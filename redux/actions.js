import { ADD_TODO, DELETE_TODO, UPDATE_TODO, ADD_TO_ACTIVITY_LOG } from "./actionTypes";

let nextTodoId = 0;

export const addTodo = (title, task,) => {
  return {
    type: ADD_TODO,
    payload: { id: ++nextTodoId, title, task },
  };
};

export const updateTodo = (id, title, task,) => ({
  type: UPDATE_TODO,
  payload: { id, title, task, },
});

export const deleteTodo = (id) => ({
  type: DELETE_TODO,
  payload: { id },
});

export const addToActivityLog = (log) => ({
  type: ADD_TO_ACTIVITY_LOG,
  payload: log,
});