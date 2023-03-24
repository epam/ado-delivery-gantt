import * as React from 'react';
import { useEffect } from 'react';
import * as SDK from 'azure-devops-extension-sdk';

import {
  CommonServiceIds,
  getClient,
  IProjectPageService,
} from 'azure-devops-extension-api';
import { CoreRestClient } from 'azure-devops-extension-api/Core';

import { BacklogItem, ExtensionManagementUtil, GanttHubDocument, TeamItem } from "../../service/helper";
import { ContentSize } from "azure-devops-ui/Callout";
import { CustomHeader, HeaderTitle, HeaderTitleArea, HeaderTitleRow, TitleSize } from "azure-devops-ui/Header";
import { CustomPanel, PanelCloseButton, PanelContent, PanelFooter } from "azure-devops-ui/Panel";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { FormItem } from "azure-devops-ui/FormItem";
import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";
import { Dropdown, DropdownExpandableButton } from "azure-devops-ui/Dropdown";
import { Observer } from "azure-devops-ui/Observer";
import { ObservableArray, ObservableValue } from "azure-devops-ui/Core/Observable";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { DropdownMultiSelection } from "azure-devops-ui/Utilities/DropdownSelection";
import { BacklogLevelConfiguration, WorkRestClient } from "azure-devops-extension-api/Work";

export interface NewPanelProps {
  isChecked: boolean;
  onDismiss: (isChecked: boolean) => void;
}

export const AddGanttPanel: React.FC<NewPanelProps> = ({
  isChecked,
  onDismiss,
}) => {
  const teamSelection = new DropdownMultiSelection();
  const team = new ObservableArray<IListBoxItem<TeamItem>>();
  const teamMap = new Map<string, TeamItem>();

  const backlogSelection = new DropdownMultiSelection();
  const backlog = new ObservableArray<IListBoxItem<BacklogItem>>();
  const backlogMap = new Map<string, BacklogItem>();

  const nameObservable = new ObservableValue<string | undefined>("");
  const descriptionObservable = new ObservableValue<string | undefined>("");

  const ganttNameHasError = new ObservableValue<boolean | undefined>(true);
  const teamSelectHasError = new ObservableValue<boolean | undefined>(true);
  const backlogSelectHasError = new ObservableValue<boolean | undefined>(true);

  useEffect(() => {
    (async () => {
      await SDK.ready();
      const projectService = await SDK.getService<IProjectPageService>(
        CommonServiceIds.ProjectPageService
      );
      const project = await projectService.getProject();
      if (project) {
        const workRestClient = getClient(WorkRestClient);
        const coreClient = getClient(CoreRestClient);

        const teams = await coreClient.getTeams(project.name);
        team.push(...teams.map(({ id, name }) => ({ id, text: name, data: { id, name } } as IListBoxItem<TeamItem>)));
        teams.forEach(team => teamMap.set(team.id, team));
        teamSelection.select(0, teams.length, true, true);
        teamSelectHasError.value = teamSelection.selectedCount === 0;

        const backlogConfigurations = await workRestClient.getBacklogConfigurations({
          project: project.name,
          projectId: project.id,
          team: teams[0].name, // todo: assumption backlog config will be the same for all teams - maybe wrong
          teamId: teams[0].id,
        }).then(({ portfolioBacklogs = [] as BacklogLevelConfiguration[], requirementBacklog = {} as BacklogLevelConfiguration, taskBacklog = {} as BacklogLevelConfiguration }) => {
          return [...portfolioBacklogs, requirementBacklog, taskBacklog]
            .reduce((acc, next) => {
              const { rank = 0, workItemTypes = [] } = next;
              return [...acc, ...workItemTypes.map(({ name }) => ({ rank, name }))]
            }, [] as BacklogItem[]);
        });

        backlog.push(...backlogConfigurations
          .sort(({ rank: r1 = 0 }, { rank: r2 = 0 }) => r2 - r1)
          .map(t => { return { id: t.name, data: t, text: t.name } }));
        backlogConfigurations.forEach(backlog => backlogMap.set(backlog.name, backlog));
        backlogSelection.select(0, backlogConfigurations.length, true, true);
        backlogSelectHasError.value = backlogSelection.selectedCount === 0;
      }
    })();
  }, [])

  const onSave = React.useCallback(async (name: string, description: string, teams: TeamItem[], backlog: BacklogItem[]) => {
    const createdBy = SDK.getUser().displayName;
    const now = new Date().toISOString();
    const item = await ExtensionManagementUtil.createItem({
      name,
      description,
      createdBy,
      lastModifiedBy: createdBy,
      createdDate: now,
      lastModifiedDate: now,
      options: {
        teams,
        backlog
      }
    }).handle({} as GanttHubDocument, "Unable create new gant board.", true)

    if (Object.keys(item).length !== 0) {
      onDismiss(isChecked);
    }
  }, []);

  return (
    <CustomPanel
      onDismiss={() => onDismiss(isChecked)}
      size={ContentSize.Large}
    >
      <CustomHeader className="bolt-header-with-commandbar">
        <HeaderTitleArea>
          <HeaderTitleRow>
            <HeaderTitle titleSize={TitleSize.Large} children={"New delivery gantt"}></HeaderTitle>
          </HeaderTitleRow>
        </HeaderTitleArea>
        <PanelCloseButton
          onDismiss={() => onDismiss(isChecked)}
        />
      </CustomHeader>
      <PanelContent>
        <div className="flex-column flex-grow rhythm-vertical-24">
          <div className="padding-horizontal-20 rhythm-vertical-16">
            A delivery gantt shows you when work will be delivered across your teams.
          </div>
          <div className="padding-horizontal-20 rhythm-vertical-16">
            <FormItem
              label="Name*"
              message="Custom Gantt name"
            >
              <TextField
                value={nameObservable}
                onChange={(e, newValue) => {
                  nameObservable.value = newValue;
                  ganttNameHasError.value = (nameObservable.value?.trim().length === 0);
                }}
                placeholder="Name"
                width={TextFieldWidth.auto}
                maxLength={64}
                required={true}
              />
            </FormItem>
          </div>
          <div className="padding-horizontal-20 rhythm-vertical-16">
            <FormItem
              label="Description"
              message="Gantt description"
            >
              <TextField
                ariaLabel="Aria label"
                value={descriptionObservable}
                onChange={(e, newValue) => (descriptionObservable.value = newValue)}
                multiline
                rows={4}
                maxLength={255}
                width={TextFieldWidth.auto}
              />
            </FormItem>
          </div>
          <div className="padding-horizontal-20 rhythm-vertical-16">
            <FormItem
              label="Team*"
              message="Team selection"
            >
              <Observer selection={teamSelection}>
                {() => (
                  <Dropdown
                    className="scale-dropdown"
                    actions={[
                      {
                        className: "bolt-dropdown-action-right-button",
                        disabled: teamSelection.selectedCount === 0,
                        iconProps: { iconName: "Clear" },
                        text: "Clear",
                        onClick: () => {
                          teamSelection.clear();
                          teamMap.clear();
                          teamSelectHasError.value = true;
                        }
                      }
                    ]}
                    items={team}
                    minCalloutWidth={300}
                    showFilterBox={true}
                    renderExpandable={props => <DropdownExpandableButton style={{ width: 140 }} {...props} />}
                    onSelect={(_, { data }) => {
                      !teamMap.has(data!.id) && teamMap.set(data!.id, data!) || teamMap.delete(data!.id);
                      teamSelectHasError.value = teamSelection.selectedCount === 0;
                    }}
                    selection={teamSelection}
                  />)}
              </Observer>
            </FormItem>
          </div>
          <div className="padding-horizontal-20 rhythm-vertical-16">
            <FormItem
              label="Backlog*"
              message="Baclog selection"
            >
              <Observer selection={backlogSelection}>
                {() => (
                  <Dropdown
                    className="scale-dropdown"
                    actions={[
                      {
                        className: "bolt-dropdown-action-right-button",
                        disabled: backlogSelection.selectedCount === 0,
                        iconProps: { iconName: "Clear" },
                        text: "Clear",
                        onClick: () => {
                          backlogSelection.clear();
                          backlogMap.clear();
                          backlogSelectHasError.value = true;
                        }
                      }
                    ]}
                    items={backlog}
                    minCalloutWidth={300}
                    showFilterBox={true}
                    renderExpandable={props => <DropdownExpandableButton style={{ width: 140 }} {...props} />}
                    onSelect={(_, { data }) => {
                      !backlogMap.has(data!.name) && backlogMap.set(data!.name, data!) || backlogMap.delete(data!.name);
                      backlogSelectHasError.value = backlogSelection.selectedCount === 0;
                    }}
                    selection={backlogSelection}
                  />)}
              </Observer>
            </FormItem>
          </div>
        </div>
      </PanelContent>
      <PanelFooter>
        <ButtonGroup className="bolt-panel-footer-buttons">
          <Button
            text="Cancel"
            onClick={() => onDismiss(isChecked)}
          />
          <Observer name={ganttNameHasError} teamSelect={teamSelectHasError} taskSelect={backlogSelectHasError}>
            {() => (
              <Button
                text="Create"
                primary={true}
                disabled={ganttNameHasError.value || teamSelectHasError.value || backlogSelectHasError.value}
                onClick={() => {
                  onSave(nameObservable.value!,
                    descriptionObservable.value!,
                    [...teamMap.values()],
                    [...backlogMap.values()],
                  );
                }
                }
              />
            )}
          </Observer>
        </ButtonGroup>
      </PanelFooter>
    </CustomPanel>
  );
}


