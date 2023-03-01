import { WebApiTeam } from "azure-devops-extension-api/Core";
import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";

interface ProgressInterface {
    parentId: number;
    subtaskProgress: number;
    timelineProgress?: number;
    status?: string;
    type: string;
}

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

function calculateSimpleItems(id: string, items: WorkItem[], progressMap: Map<string, ProgressInterface>) {
    items.forEach(item => {
        let itemProgress = item.fields["Microsoft.VSTS.Common.ClosedDate"] ? 1 : 0;
        let parentId = getParentId(item);
        if (parentId != null) {
            progressMap.set(id + item.id, {
                parentId: parentId ? parseInt(parentId) : 0,
                subtaskProgress: itemProgress,
                type: item.fields["System.WorkItemType"]
            });
        }
    });
}

function calculateTimelineProgressItems(id: string, items: WorkItem[], progressMap: Map<string, ProgressInterface>) {
    items.forEach(item => {
        if (item.fields['Microsoft.VSTS.Scheduling.StartDate'] && item.fields['Microsoft.VSTS.Scheduling.TargetDate']) {
            const startDate = new Date(item.fields['Microsoft.VSTS.Scheduling.StartDate']);
            const endDate = new Date(item.fields['Microsoft.VSTS.Scheduling.TargetDate']);
            let subitemProgress = Array.from(progressMap.values())
                .filter(subItem => subItem.parentId === item.id)
                .map(subItem => subItem.subtaskProgress);
            let itemProgress = calculateProgress(startDate, endDate, subitemProgress);
            let parentId = getParentId(item);
            if (parentId != null || item.fields["System.WorkItemType"] === 'Epic') {
                progressMap.set(id + item.id, {
                    parentId: parentId ? parseInt(parentId) : 0,
                    subtaskProgress: itemProgress[0],
                    timelineProgress: itemProgress[1],
                    status: itemProgress[2],
                    type: item.fields["System.WorkItemType"]
                });
            }
        }
    });
}

function getParentId(item: WorkItem) {
    return item.relations ?
        item.relations.filter((relation) => relation.rel === 'System.LinkTypes.Hierarchy-Reverse')
            .map((relation) => relation.url.substring(relation.url.lastIndexOf('/') + 1))[0]
        : null;
}

function calculateProgress(startDate: Date, endDate: Date, subtasks: number[]): [storyProgress: number, timelineProgress: number, status: string] {
    const today = new Date();
    const totalDays = dateDiff(startDate, endDate);
    const remainingDays = dateDiff(today, endDate);
    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter((t) => t === 1).length;

    const subtaskProgress = totalSubtasks > 0 ? completedSubtasks / totalSubtasks : 0;
    const timelineProgress = totalDays > 0 ? (remainingDays / totalDays) : 0;

    let status;
    if (subtaskProgress >= (1 - timelineProgress * 1.25)) {
        status = "green";
    } else if ((subtaskProgress >= (1 - timelineProgress * 1.5)) && (subtaskProgress < (1 - timelineProgress * 1.25))) {
        status = "yellow"
    } else {
        status = "red";
    } return [subtaskProgress, timelineProgress, status];
}

function dateDiff(startDate: Date, endDate: Date) {
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}
