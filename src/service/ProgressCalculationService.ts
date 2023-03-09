import { WebApiTeam } from "azure-devops-extension-api/Core";
import { WorkItem, WorkItemLink } from "azure-devops-extension-api/WorkItemTracking";

export interface ProgressInterface {
    parentId: number;
    subtaskProgress: number;
    timelineProgress?: number;
    status?: Styles;
    type: string;
    state: string;
    description: string;
}

export type TeamDictionaryValue = { connections: { [key: string]: WorkItemLink[]; }, map: Map<string, WorkItem> };

const htmlPattern = /<(?:.|\s)*?>/g;

const stripHTML = (data: any) => (`${data || ""}`).replace(/<(?:.|\s)*?>/g, "");

export function getProgressMap(teams: WebApiTeam[], teamDictionary: Map<string, TeamDictionaryValue>): Map<string, ProgressInterface> {
    let progressMap = new Map<string, ProgressInterface>();

    teams.forEach(team => {
        const { connections, map } = {...teamDictionary.get(team.id)!};

        Object.keys(connections)
            .map(itemId => connections[itemId])
            .filter(it => it.length === 1)
            .reduce((acc, next) => [...acc, ...next], [])
            .forEach(it => calculateSimpleItems(team.id, map.get(`${it.target.id}`)!, progressMap));

        const set = new Set<string>();

        const itemsWithChild = Object.keys(connections)
            .map(itemId => connections[itemId])
            .filter(it => it.length > 1)
            .reduce((acc, next) => [...acc, ...next], [])

        const parentsId = new Set(itemsWithChild.filter(it => it.source).map(it => it.source.id))
        itemsWithChild
            .filter(it => !parentsId.has(it.target.id))
            .forEach(it => calculateSimpleItems(team.id, map.get(`${it.target.id}`)!, progressMap));

        Object.keys(connections)
            .map(itemId => connections[itemId])
            .filter(it => it.length > 1)
            .forEach(it => {
                it.slice().reverse()
                    .filter(it => parentsId.has(it.target.id))
                    .forEach(e => calculateTimelineProgressItems(team.id, map.get(`${e.target.id}`)!, progressMap))
            });
    });
    console.log("getProgressMap progressMap", JSON.stringify(progressMap));
    return progressMap;
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

function calculateSimpleItems(id: string, item: WorkItem, progressMap: Map<string, ProgressInterface>) {
    //items.forEach(item => {
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
    //});
}

function calculateTimelineProgressItems(id: string, item: WorkItem, progressMap: Map<string, ProgressInterface>) {
    //items.forEach(item => {
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
    //});
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
