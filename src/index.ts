/**
 * File: index.ts
 * Purpose: Entry point and command-line interface for the Task Manager.
 * Author: [Your Name]
 * Date: [Current Date]
 */

import * as readline from "readline";
import { TaskManager } from "./taskManager";
import { Priority } from "./task";

// Create the TaskManager instance
const manager = new TaskManager();

// Set up the command-line interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Function: promptUser
 * Purpose: Prompts the user for input and returns a Promise.
 */
function promptUser(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer.trim()));
    });
}

/**
 * Function: displayMenu
 * Purpose: Shows the main menu options.
 */
function displayMenu(): void {
    console.log("\n========================================");
    console.log("       TASK MANAGER");
    console.log("========================================");
    console.log("1. Add a new task");
    console.log("2. List all tasks");
    console.log("3. Complete a task");
    console.log("4. Delete a task");
    console.log("5. Exit");
    console.log("========================================");
}

/**
 * Function: formatDate
 * Purpose: Formats a Date object into a readable string.
 */
function formatDate(date: Date | null): string {
    if (!date) return "N/A";
    return date.toLocaleString();
}

/**
 * Function: listTasks
 * Purpose: Displays all tasks with formatting.
 */
function listTasks(): void {
    const tasks = manager.getAllTasks();
    console.log("\n----------------------------------------");
    console.log(`TOTAL TASKS: ${manager.getTaskCount()}`);
    console.log("----------------------------------------");

    if (tasks.length === 0) {
        console.log("No tasks found. Add one to get started!");
        return;
    }

    for (const task of tasks) {
        const statusIcon = task.status === "completed" ? "[X]" : "[ ]";
        const priorityTag = `(${task.priority.toUpperCase()})`;
        console.log(
            `${statusIcon} [${task.id}] ${task.name} ${priorityTag}`
        );
        console.log(`      Status: ${task.status}`);
        console.log(`      Created: ${formatDate(task.createdAt)}`);
        if (task.completedAt) {
            console.log(`      Completed: ${formatDate(task.completedAt)}`);
        }
    }
    console.log("----------------------------------------");
}

/**
 * Function: main
 * Purpose: Main loop of the application.
 */
async function main(): Promise<void> {
    console.log("Welcome to the Task Manager!");
    console.log(`Loaded ${manager.getTaskCount()} task(s) from storage.`);

    let running = true;

    while (running) {
        displayMenu();
        const choice = await promptUser("Enter your choice: ");

        switch (choice) {
            case "1": {
                const name = await promptUser("Enter task name: ");
                if (!name) {
                    console.log("Task name cannot be empty.");
                    break;
                }
                const priorityInput = await promptUser(
                    "Enter priority (low/medium/high) [default: medium]: "
                );
                const priority: Priority =
                    priorityInput === "low" || priorityInput === "high"
                        ? priorityInput
                        : "medium";
                const task = manager.addTask(name, priority);
                console.log(`\nTask added: [${task.id}] ${task.name}`);
                break;
            }

            case "2":
                listTasks();
                break;

            case "3": {
                const idInput = await promptUser("Enter task ID to complete: ");
                const id = parseInt(idInput, 10);
                if (isNaN(id)) {
                    console.log("Invalid ID. Please enter a number.");
                    break;
                }
                if (manager.completeTask(id)) {
                    console.log(`\nTask ${id} marked as completed!`);
                } else {
                    console.log(`\nTask ${id} not found.`);
                }
                break;
            }

            case "4": {
                const idInput = await promptUser("Enter task ID to delete: ");
                const id = parseInt(idInput, 10);
                if (isNaN(id)) {
                    console.log("Invalid ID. Please enter a number.");
                    break;
                }
                if (manager.deleteTask(id)) {
                    console.log(`\nTask ${id} deleted!`);
                } else {
                    console.log(`\nTask ${id} not found.`);
                }
                break;
            }

            case "5":
                running = false;
                console.log("\nThank you for using the Task Manager. Goodbye!");
                rl.close();
                break;

            default:
                console.log("\nInvalid choice. Please select 1-5.");
        }
    }
}

// Run the application
main().catch((error) => {
    console.error("Fatal error:", error);
    rl.close();
});