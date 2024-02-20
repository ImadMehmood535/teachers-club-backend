/** @format */

const task_arr = [
  {
    name: "test1",
    status: true,
  },
  {
    name: "test2",
    status: false,
  },
  {
    name: "test3",
    status: false,
  },
  {
    name: "test4",
    status: true,
  },
  {
    name: "test5",
    status: false,
  },
  {
    name: "test6",
    status: false,
  },
  {
    name: "test7",
    status: true,
  },
  {
    name: "test8",
    status: false,
  },
  {
    name: "test9",
    status: false,
  },
  {
    name: "test10",
    status: false,
  },
];
const start_deadline = "2024-01-01T00:00:00.000Z";
const end_deadline = "2024-02-28T00:00:00.000Z";

const getTaskStatus = (task_arr, end_deadline, start_deadline) => {
  let no_of_days =
    new Date(end_deadline).getTime() - new Date(start_deadline).getTime();
  no_of_days = Math.floor(no_of_days / (1000 * 3600 * 24));
  const tasks_per_day = task_arr.length / no_of_days;
  let tasks_achieved = 0;
  for (let index = 0; index < task_arr.length; index++) {
    if (task_arr[index]?.status) {
      tasks_achieved += 1;
    }
  }
  const no_of_days_passed =
    new Date().getDate() - new Date(start_deadline).getDate();
  if (no_of_days_passed > no_of_days) {
    return "Already Due";
  }
  if (tasks_achieved == task_arr.length) {
    return "Completed";
  }

  const task_should_achieved = tasks_per_day * no_of_days_passed;
  const status = Math.round((tasks_achieved / task_should_achieved) * 100);
  let res = "";
  if (status > 80) {
    res = "Can be achieved";
  } else if (status < 80) {
    res = "At risk";
  } else if (status > 90) {
    res = "On track";
  } else {
    res = "Fallback";
  }
  return res;
};

console.log(getTaskStatus(task_arr, end_deadline, start_deadline));
