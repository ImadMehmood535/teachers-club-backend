/** @format */

const tasks = [
  {
    id: 1,
    name: "task 1",
    status: true,
  },
  {
    id: 2,
    name: "task 2",
    status: true,
  },
  {
    id: 3,
    name: "task 3",
    status: true,
  },
  {
    id: 4,
    name: "task 4",
    status: false,
  },
  {
    id: 5,
    name: "task 5",
    status: false,
  },
  {
    id: 6,
    name: "task 6",
    status: false,
  },
  {
    id: 7,
    name: "task 7",
    status: false,
  },
  {
    id: 8,
    name: "task 8",
    status: false,
  },
  {
    id: 9,
    name: "task 9",
    status: false,
  },
  {
    id: 10,
    name: "task 10",
    status: false,
  },
  {
    id: 11,
    name: "task 10",
    status: false,
  },
];

class TaskManager {
  constructor(tasks) {
    this.tasks = tasks;
  }

  completedStatus() {
    const completed = this.tasks.filter((task) => task.status).length;
    return (completed / this.tasks.length) * 100;
  }

  moduleStatus(percentage, numberOfDaysConsumed, totalDays) {
    const consumedDuration = (numberOfDaysConsumed / totalDays) * 100;

    const predictedTasks = Math.round((percentage / 100) * this.tasks.length);

    if (
      percentage <= 30 &&
      predictedTasks < this.completedStatus() &&
      consumedDuration > 30
    ) {
      return `Under Risk. Predicted tasks: ${predictedTasks}`;
    } else {
      return "On Track";
    }
  }
}

const taskManager = new TaskManager(tasks);
const percentage = taskManager.completedStatus();
const result = taskManager.moduleStatus(percentage, 16, 30);

console.log(result);
