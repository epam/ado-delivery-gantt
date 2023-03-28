import "./component.scss";

import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";

import { Card } from "azure-devops-ui/Card";
import { GanttView } from "./gantt";
import { ExtensionManagementUtil, FilterOptions } from "../service/helper";
import { RootHubContext } from "../context";

export interface GanttPagerops {
  ganttId: string
}

export const GanttPage: React.FC<GanttPagerops> = ({
  ganttId
}) => {

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>();
  const [pageLoad, setPageLoad] = useState(true);
  const rootContext = useContext(RootHubContext);

  useEffect(() => {
    (async () => {
      const { name, description, options } = await ExtensionManagementUtil.getItem(ganttId);
      setTitle(name);
      setDescription(description);
      setFilterOptions(options);
      setPageLoad(false);
    })();
  }, [ganttId, rootContext])

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
            ganttId={ganttId}
            filterOptions={filterOptions!}
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
