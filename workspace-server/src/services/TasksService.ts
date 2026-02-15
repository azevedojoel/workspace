/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { google, tasks_v1 } from 'googleapis';
import { AuthManager } from '../auth/AuthManager';
import { logToFile } from '../utils/logger';
import { gaxiosOptions } from '../utils/GaxiosConfig';
import { TASKS_LIST_MAX_RESULTS } from '../utils/constants';

export class TasksService {
    constructor(private authManager: AuthManager) {
    }

    private async getTasksClient(): Promise<tasks_v1.Tasks> {
        const auth = await this.authManager.getAuthenticatedClient();
        const options = { ...gaxiosOptions, auth };
        return google.tasks({ version: 'v1', ...options }) as unknown as tasks_v1.Tasks;
    }

    private handleError(error: unknown, context: string) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logToFile(`Error during ${context}: ${errorMessage}`);
        return {
            content: [{
                type: "text" as const,
                text: JSON.stringify({ error: errorMessage })
            }]
        };
    }

    public listTaskLists = async ({
        maxResults,
        pageToken
    }: {
        maxResults?: number;
        pageToken?: string;
    } = {}) => {
        try {
            logToFile('Listing task lists');
            const tasks = await this.getTasksClient();
            const res = await tasks.tasklists.list({ maxResults, pageToken });
            const items = res.data.items || [];
            logToFile(`Found ${items.length} task lists`);
            return {
                content: [{
                    type: "text" as const,
                    text: JSON.stringify({
                        items: items.map(tl => ({ id: tl.id, title: tl.title, updated: tl.updated })),
                        nextPageToken: res.data.nextPageToken
                    }, null, 2)
                }]
            };
        } catch (error) {
            return this.handleError(error, 'tasks.listTaskLists');
        }
    };

    public getTaskList = async ({ taskListId }: { taskListId: string }) => {
        try {
            logToFile(`Getting task list ${taskListId}`);
            const tasks = await this.getTasksClient();
            const res = await tasks.tasklists.get({ tasklist: taskListId });
            return {
                content: [{
                    type: "text" as const,
                    text: JSON.stringify(res.data, null, 2)
                }]
            };
        } catch (error) {
            return this.handleError(error, 'tasks.getTaskList');
        }
    };

    public createTaskList = async ({ title }: { title: string }) => {
        try {
            logToFile(`Creating task list: ${title}`);
            const tasks = await this.getTasksClient();
            const res = await tasks.tasklists.insert({
                requestBody: { title }
            });
            logToFile(`Created task list: ${res.data.id}`);
            return {
                content: [{
                    type: "text" as const,
                    text: JSON.stringify(res.data, null, 2)
                }]
            };
        } catch (error) {
            return this.handleError(error, 'tasks.createTaskList');
        }
    };

    public updateTaskList = async ({ taskListId, title }: { taskListId: string; title: string }) => {
        try {
            logToFile(`Updating task list ${taskListId}`);
            const tasks = await this.getTasksClient();
            const res = await tasks.tasklists.patch({
                tasklist: taskListId,
                requestBody: { title }
            });
            return {
                content: [{
                    type: "text" as const,
                    text: JSON.stringify(res.data, null, 2)
                }]
            };
        } catch (error) {
            return this.handleError(error, 'tasks.updateTaskList');
        }
    };

    public deleteTaskList = async ({ taskListId }: { taskListId: string }) => {
        try {
            logToFile(`Deleting task list ${taskListId}`);
            const tasks = await this.getTasksClient();
            await tasks.tasklists.delete({ tasklist: taskListId });
            return {
                content: [{
                    type: "text" as const,
                    text: JSON.stringify({ message: `Successfully deleted task list ${taskListId}` })
                }]
            };
        } catch (error) {
            return this.handleError(error, 'tasks.deleteTaskList');
        }
    };

    public listTasks = async ({
        taskListId,
        maxResults = TASKS_LIST_MAX_RESULTS,
        pageToken,
        showCompleted = true,
        showHidden,
        dueMin,
        dueMax
    }: {
        taskListId: string;
        maxResults?: number;
        pageToken?: string;
        showCompleted?: boolean;
        showHidden?: boolean;
        dueMin?: string;
        dueMax?: string;
    }) => {
        try {
            logToFile(`Listing tasks for list ${taskListId}, maxResults: ${maxResults}`);
            const tasks = await this.getTasksClient();
            const res = await tasks.tasks.list({
                tasklist: taskListId,
                maxResults,
                pageToken,
                showCompleted,
                showHidden,
                dueMin,
                dueMax
            });
            const items = res.data.items || [];
            logToFile(`Found ${items.length} tasks`);
            return {
                content: [{
                    type: "text" as const,
                    text: JSON.stringify({
                        items,
                        nextPageToken: res.data.nextPageToken
                    }, null, 2)
                }]
            };
        } catch (error) {
            return this.handleError(error, 'tasks.listTasks');
        }
    };

    public getTask = async ({ taskListId, taskId }: { taskListId: string; taskId: string }) => {
        try {
            logToFile(`Getting task ${taskId} from list ${taskListId}`);
            const tasks = await this.getTasksClient();
            const res = await tasks.tasks.get({
                tasklist: taskListId,
                task: taskId
            });
            return {
                content: [{
                    type: "text" as const,
                    text: JSON.stringify(res.data, null, 2)
                }]
            };
        } catch (error) {
            return this.handleError(error, 'tasks.getTask');
        }
    };

    public createTask = async ({
        taskListId,
        title,
        notes,
        due,
        parent,
        previous
    }: {
        taskListId: string;
        title: string;
        notes?: string;
        due?: string;
        parent?: string;
        previous?: string;
    }) => {
        try {
            logToFile(`Creating task in list ${taskListId}: ${title}`);
            const tasks = await this.getTasksClient();
            const requestBody: tasks_v1.Schema$Task = { title };
            if (notes !== undefined) requestBody.notes = notes;
            if (due !== undefined) requestBody.due = due;
            const res = await tasks.tasks.insert({
                tasklist: taskListId,
                parent,
                previous,
                requestBody
            });
            logToFile(`Created task: ${res.data.id}`);
            return {
                content: [{
                    type: "text" as const,
                    text: JSON.stringify(res.data, null, 2)
                }]
            };
        } catch (error) {
            return this.handleError(error, 'tasks.createTask');
        }
    };

    public updateTask = async ({
        taskListId,
        taskId,
        title,
        notes,
        status,
        due
    }: {
        taskListId: string;
        taskId: string;
        title?: string;
        notes?: string;
        status?: 'needsAction' | 'completed';
        due?: string;
    }) => {
        try {
            logToFile(`Updating task ${taskId} in list ${taskListId}`);
            const tasks = await this.getTasksClient();
            const requestBody: tasks_v1.Schema$Task = {};
            if (title !== undefined) requestBody.title = title;
            if (notes !== undefined) requestBody.notes = notes;
            if (status !== undefined) requestBody.status = status;
            if (due !== undefined) requestBody.due = due;
            const res = await tasks.tasks.patch({
                tasklist: taskListId,
                task: taskId,
                requestBody
            });
            return {
                content: [{
                    type: "text" as const,
                    text: JSON.stringify(res.data, null, 2)
                }]
            };
        } catch (error) {
            return this.handleError(error, 'tasks.updateTask');
        }
    };

    public deleteTask = async ({ taskListId, taskId }: { taskListId: string; taskId: string }) => {
        try {
            logToFile(`Deleting task ${taskId} from list ${taskListId}`);
            const tasks = await this.getTasksClient();
            await tasks.tasks.delete({
                tasklist: taskListId,
                task: taskId
            });
            return {
                content: [{
                    type: "text" as const,
                    text: JSON.stringify({ message: `Successfully deleted task ${taskId}` })
                }]
            };
        } catch (error) {
            return this.handleError(error, 'tasks.deleteTask');
        }
    };

    public clearCompletedTasks = async ({ taskListId }: { taskListId: string }) => {
        try {
            logToFile(`Clearing completed tasks from list ${taskListId}`);
            const tasks = await this.getTasksClient();
            await tasks.tasks.clear({ tasklist: taskListId });
            return {
                content: [{
                    type: "text" as const,
                    text: JSON.stringify({ message: `Successfully cleared completed tasks from list ${taskListId}` })
                }]
            };
        } catch (error) {
            return this.handleError(error, 'tasks.clearCompletedTasks');
        }
    };

    public moveTask = async ({
        taskListId,
        taskId,
        destinationTaskListId,
        parent,
        previous
    }: {
        taskListId: string;
        taskId: string;
        destinationTaskListId?: string;
        parent?: string;
        previous?: string;
    }) => {
        try {
            logToFile(`Moving task ${taskId} in list ${taskListId}`);
            const tasks = await this.getTasksClient();
            const res = await tasks.tasks.move({
                tasklist: taskListId,
                task: taskId,
                destinationTasklist: destinationTaskListId,
                parent,
                previous
            });
            return {
                content: [{
                    type: "text" as const,
                    text: JSON.stringify(res.data, null, 2)
                }]
            };
        } catch (error) {
            return this.handleError(error, 'tasks.moveTask');
        }
    };
}
