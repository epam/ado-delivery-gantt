import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";

interface ProgressInterface {
    parentId: number;
    subtaskProgress: number;
    timelineProgress?: number;
    status?: string;
    type: string;
}

export function getProgressMap(projects: { id: String; items: WorkItem[] }[]): Map<number, ProgressInterface>[] {
    return projects.map(project => {
        let projectItems = project['items'];
        let tasks = projectItems.filter((item) => item.fields['System.WorkItemType'] === 'Task');
        let stories = projectItems.filter((item) => item.fields['System.WorkItemType'] === 'User Story');
        let features = projectItems.filter((item) => item.fields['System.WorkItemType'] === 'Feature');
        let epics = projectItems.filter((item) => item.fields['System.WorkItemType'] === 'Epic');
        let progressMap: Map<number, ProgressInterface> = new Map<number, ProgressInterface>();

        calculateSimpleItems(tasks, progressMap);
        calculateSimpleItems(stories, progressMap);
        calculateTimelineProgressItems(features, progressMap);
        calculateTimelineProgressItems(epics, progressMap);
        return progressMap;
    });
}

function calculateSimpleItems(items: WorkItem[], progressMap: Map<number, ProgressInterface>) {
    items.forEach(item => {
        let itemProgress = item.fields["Microsoft.VSTS.Common.ClosedDate"] ? 1 : 0;
        let parentId = getParentId(item);
        if (parentId != null) {
            progressMap.set(item.id, {
                parentId: parentId ? parseInt(parentId) : 0,
                subtaskProgress: itemProgress,
                type: item.fields["System.WorkItemType"]
            });
        }
    });
}

function calculateTimelineProgressItems(items: WorkItem[], progressMap: Map<number, ProgressInterface>) {
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
                progressMap.set(item.id, {
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
