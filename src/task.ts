/**
 * File: task.ts
 * Purpose: Defines the Task interface, Status type, and Priority type.
 * Author: [Your Name]
 * Date: [Current Date]
 */

// Type Alias / Union Type - demonstrates TypeScript union types
export type Status = "pending" | "completed";
export type Priority = "low" | "medium" | "high";

/**
 * Interface: Task
 * Purpose: Defines the shape of a task object.
 */
export interface Task {
    id: number;
    name: string;
    status: Status;
    priority: Priority;
    createdAt: Date;
    completedAt: Date | null;
}

/**
 * Function: createTask
 * Purpose: Factory function to create a new Task object.
 * Parameters:
 *   - id: Unique identifier for the task
 *   - name: Description of the task
 *   - priority: Priority level of the task
 * Returns: A new Task object with default values.
 */
export function createTask(id: number, name: string, priority: Priority = "medium"): Task {
    return {
        id,
        name,
        status: "pending",
        priority,
        createdAt: new Date(),
        completedAt: null
    };
}