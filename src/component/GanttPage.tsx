import "./component.scss";

import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";

import { GanttView } from "./gantt";
import { Context, ExtensionManagementUtil } from "../service/helper";
import { ProgressInterface } from "../service/ProgressCalculationService";
import { Card } from "azure-devops-ui/Card";
import { RootHubContext } from "../context";
import { DaemonCommandType, daemonCommandBuilder } from "../daemon";

export interface GanttPagerops {
  ganttId: string
}

export const GanttPage: React.FC<GanttPagerops> = ({
  ganttId
}) => {

  const [context, setContext] = useState<Context>({ project: undefined } as Context);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [progressMap, setProgressMap] = useState<Map<string, ProgressInterface>>(new Map<string, ProgressInterface>());
  const [pageLoad, setPageLoad] = useState(true);
  const rootContext = useContext(RootHubContext);

  useEffect(() => {
    (async () => {
      const { workItemTypes, progressMap, project } = rootContext;
      const { name, description, options } = await ExtensionManagementUtil.getItem(ganttId);
      setTitle(name);
      setDescription(description);
      setProgressMap(progressMap);
      setContext({ ganttId, project, workItemTypes, options });
      setPageLoad(false);
    })();
  }, [ganttId, rootContext])

  const reloadProgressMap = (id: string) => {
    // id for reset only related tree!
    rootContext.daemonController.fireCommand(daemonCommandBuilder()
      .type(DaemonCommandType.BUILD_PROGRESS_MAP)
      .payload({ workItemTypes: rootContext.workItemTypes, project: rootContext.project })
      .build());
  }

  return (
    <div className="page-content page-content-top rhythm-vertical-16">
      {!pageLoad ? (<Card
        className="bolt-table-card"
        contentProps={{ contentPadding: false, className: "gantt-card-content" }}
        titleProps={{ text: title }}
        headerDescriptionProps={{ text: description }}
      >
        <div className="page-content">
          <GanttView
            context={context!}
            progressMap={progressMap}
            reloadProgressMap={reloadProgressMap}
          />
        </div>
      </Card>)
        : (
          <div style={{ marginTop: 50 }}>
            <Spinner size={SpinnerSize.large} label="Loading..." />
          </div>
        )}
    </div>
  );
}
