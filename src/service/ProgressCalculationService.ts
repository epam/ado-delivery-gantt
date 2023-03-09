import { WebApiTeam } from "azure-devops-extension-api/Core";
import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";

export interface ProgressInterface {
    parentId: number;
    subtaskProgress: number;
    timelineProgress?: number;
    status?: Styles;
    type: string;
    state: string;
    description: string;
}

const htmlPattern = /<(?:.|\s)*?>/g;

const stripHTML = (data: any) => (`${data || ""}`).replace(/<(?:.|\s)*?>/g, "");

export function getProgressMap(teams: WebApiTeam[], map: Map<String, WorkItem[]>): Map<string, ProgressInterface> {
    let progressMap = new Map<string, ProgressInterface>();
    teams.forEach(team => {

        let tasks = map.get(team.id + 'Task');
        let stories = map.get(team.id + 'User Story');
        let features = map.get(team.id + 'Feature');
        let epics = map.get(team.id + 'Epic');

        calculateSimpleItems(team.id, tasks || [], progressMap);
        calculateSimpleItems(team.id, stories || [], progressMap);
        calculateTimelineProgressItems(team.id, features || [], progressMap);
        calculateTimelineProgressItems(team.id, epics || [], progressMap);
        return progressMap;
    });

    return progressMap
}

export enum ItemStatus {
    DONE = "Done",
    NOT_STARTED = "Not Started",
    ON_TRACK = "On Track",
    AT_RISK = "At Risk",
    OFF_TRACK = "Off Track"
}

export const statusStyles = {
    [ItemStatus.DONE]: { backgroundColor: "rgba(103,163,3,255)", backgroundSelectedColor: "rgba(103,163,3,255)", progressColor: "rgba(103,163,3,255)", progressSelectedColor: "rgba(103,163,3,255)" },
    [ItemStatus.NOT_STARTED]: { backgroundColor: "rgba(215,217,223,255)", backgroundSelectedColor: "rgba(215,217,223,255)", progressColor: "rgba(215,217,223,255)", progressSelectedColor: "rgba(215,217,223,255)" },//grey
    [ItemStatus.ON_TRACK]: { backgroundColor: "rgba(218,239,169,255)", backgroundSelectedColor: "rgba(218,239,169,255)", progressColor: "rgba(103,163,3,255)", progressSelectedColor: "rgba(103,163,3,255)" }, //green
    [ItemStatus.AT_RISK]: { backgroundColor: "rgba(255,230,153,255)", backgroundSelectedColor: "rgba(255,230,153,255)", progressColor: "rgba(235,144,54,255)", progressSelectedColor: "rgba(235,144,54,255)" },//orange
    [ItemStatus.OFF_TRACK]: { backgroundColor: "rgba(254,215,215,255)", backgroundSelectedColor: "rgba(254,215,215,255)", progressColor: "rgba(250,75,76,255)", progressSelectedColor: "rgba(250,75,76,255)" }//red
}

interface Styles {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
    name: ItemStatus;
}

function calculateSimpleItems(id: string, items: WorkItem[], progressMap: Map<string, ProgressInterface>) {
    items.forEach(item => {
        let itemProgress = item.fields["Microsoft.VSTS.Common.ClosedDate"] ? 100 : 0;
        let parentId = getParentId(item);
        progressMap.set(`${id}_${item.id}`, {
            parentId: parentId ? parseInt(parentId) : 0,
            subtaskProgress: itemProgress,
            status: itemProgress > 0 ? { ...statusStyles[ItemStatus.DONE], name: ItemStatus.DONE } : { ...statusStyles[ItemStatus.NOT_STARTED], name: ItemStatus.NOT_STARTED },
            type: item.fields["System.WorkItemType"],
            state: item.fields["System.State"],
            description: stripHTML(item.fields["System.Description"])
        });
    });
}

function calculateTimelineProgressItems(id: string, items: WorkItem[], progressMap: Map<string, ProgressInterface>) {
    items.forEach(item => {
        const startDate = new Date(item.fields['Microsoft.VSTS.Scheduling.StartDate']);
        const endDate = new Date(item.fields['Microsoft.VSTS.Scheduling.TargetDate']);
        let subitemProgress = Array.from(progressMap.values())
            .filter(subItem => subItem.parentId === item.id)
            .map(subItem => subItem.subtaskProgress);
        let itemProgress = calculateProgress(startDate, endDate, subitemProgress);
        let parentId = getParentId(item);

        progressMap.set(`${id}_${item.id}`, {
            parentId: parentId ? parseInt(parentId) : 0,
            subtaskProgress: item.fields["System.State"] === 'Closed' ? 100 : itemProgress[0],
            status: item.fields["System.State"] === 'Closed' ? { ...statusStyles[ItemStatus.DONE], name: ItemStatus.DONE } : itemProgress[1],
            type: item.fields["System.WorkItemType"],
            state: item.fields["System.State"],
            description: stripHTML(item.fields["System.Description"])
        });
    });
}

function getParentId(item: WorkItem) {
    return item.relations ?
        item.relations.filter((relation) => relation.rel === 'System.LinkTypes.Hierarchy-Reverse')
            .map((relation) => relation.url.substring(relation.url.lastIndexOf('/') + 1))[0]
        : null;
}

function calculateProgress(startDate: Date, endDate: Date, subtasks: number[]): [storyProgress: number, status: Styles] {
    const today = new Date();
    const totalDays = dateDiff(startDate, endDate);
    const remainingDays = dateDiff(today, endDate) > 0 ? dateDiff(today, endDate) : 0;
    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter((t) => t === 100).length;

    const subtaskProgress = totalSubtasks > 0 ? completedSubtasks / totalSubtasks : 0;
    const timelineProgress = totalDays > 0 ? (remainingDays / totalDays) : 0;

    let status: ItemStatus;
    if (subtaskProgress === 0) {
        status = ItemStatus.NOT_STARTED;
    }
    if (subtaskProgress >= (1 - timelineProgress * 1.25)) {
        status = ItemStatus.ON_TRACK;
    } else if ((subtaskProgress >= (1 - timelineProgress * 1.5)) && (subtaskProgress < (1 - timelineProgress * 1.25))) {
        status = ItemStatus.AT_RISK;
    } else {
        status = ItemStatus.OFF_TRACK;
    } return [parseInt((subtaskProgress * 100).toFixed(2)), { ...statusStyles[status], name: status }];
}

function dateDiff(startDate: Date, endDate: Date) {
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}
