import {
  ADD_TODO,
  DELETE_TODO,
  UPDATE_TODO,
  ADD_TO_ACTIVITY_LOG,
} from "./actionTypes";
import uuid from "react-native-uuid";

export const addTodo = (title, task, iteration, dependentTaskId, category) => {
  return {
    type: ADD_TODO,
    payload: { id: uuid.v4(), title, task, iteration, dependentTaskId, category },
  };
};

export const updateTodo = (id, title, task, dependentTaskId) => ({
  type: UPDATE_TODO,
  payload: { id, title, task, dependentTaskId },
});

export const deleteTodo = (id) => ({
  type: DELETE_TODO,
  payload: { id },
});

export const addToActivityLog = (log) => ({
  type: ADD_TO_ACTIVITY_LOG,
  payload: log,
});
