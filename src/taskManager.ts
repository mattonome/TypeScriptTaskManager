/**
 * File: taskManager.ts
 * Purpose: Defines the TaskManager class with CRUD operations.
 *          Demonstrates classes, generics, and file I/O.
 * Author: [Your Name]
 * Date: [Current Date]
 */

import { Task, Status, Priority, createTask } from "./task";
import * as fs from "fs";
import * as path from "path";

/**
 * Generic Class: Storage<T>
 * Purpose: Demonstrates TypeScript generics by providing
 *          a generic storage container for any type.
 */
export class Storage<T> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    getAll(): T[] {
        return this.items;
    }

    remove(predicate: (item: T) => boolean): void {
        this.items = this.items.filter((item) => !predicate(item));
    }

    clear(): void {
        this.items = [];
    }

    get count(): number {
        return this.items.length;
    }
}

/**
 * Class: TaskManager
 * Purpose: Manages a collection of tasks with CRUD operations
 *          and file persistence.
 */
export class TaskManager {
    private tasks: Storage<Task>;
    private nextId: number;
    private dataFile: string;

    constructor(dataFile: string = "tasks.json") {
        this.tasks = new Storage<Task>();
        this.nextId = 1;
        this.dataFile = path.join(process.cwd(), dataFile);
        this.loadFromFile();
    }

    /**
     * Method: addTask
     * Purpose: Adds a new task to the collection.
     */
    addTask(name: string, priority: Priority = "medium"): Task {
        const task = createTask(this.nextId++, name, priority);
        this.tasks.add(task);
        this.saveToFile();
        return task;
    }

    /**
     * Method: getAllTasks
     * Purpose: Returns all tasks.
     */
    getAllTasks(): Task[] {
        return this.tasks.getAll();
    }

    /**
     * Method: completeTask
     * Purpose: Marks a task as completed.
     */
    completeTask(id: number): boolean {
        const task = this.tasks.getAll().find((t) => t.id === id);
        if (!task) return false;
        task.status = "completed";
        task.completedAt = new Date();
        this.saveToFile();
        return true;
    }

    /**
     * Method: deleteTask
     * Purpose: Deletes a task by ID.
     */
    deleteTask(id: number): boolean {
        const before = this.tasks.count;
        this.tasks.remove((t) => t.id === id);
        const after = this.tasks.count;
        if (before !== after) {
            this.saveToFile();
            return true;
        }
        return false;
    }

    /**
     * Method: getTaskCount
     * Purpose: Returns the total number of tasks.
     */
    getTaskCount(): number {
        return this.tasks.count;
    }

    /**
     * Method: saveToFile
     * Purpose: Writes tasks to a JSON file (file I/O).
     */
    private saveToFile(): void {
        try {
            const data = JSON.stringify(this.tasks.getAll(), null, 2);
            fs.writeFileSync(this.dataFile, data, "utf-8");
        } catch (error) {
            console.error("Error saving tasks:", error);
        }
    }

    /**
     * Method: loadFromFile
     * Purpose: Reads tasks from a JSON file (file I/O).
     */
    private loadFromFile(): void {
        try {
            if (fs.existsSync(this.dataFile)) {
                const raw = fs.readFileSync(this.dataFile, "utf-8");
                const parsed = JSON.parse(raw) as Task[];

                this.tasks.clear();
                let maxId = 0;
                for (const task of parsed) {
                    task.createdAt = new Date(task.createdAt);
                    task.completedAt = task.completedAt ? new Date(task.completedAt) : null;
                    this.tasks.add(task);
                    if (task.id > maxId) maxId = task.id;
                }
                this.nextId = maxId + 1;
            }
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    }
}