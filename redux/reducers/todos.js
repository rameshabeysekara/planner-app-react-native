import { ADD_TODO, DELETE_TODO, UPDATE_TODO, ADD_TO_ACTIVITY_LOG } from "../actionTypes";

const initialState = {
  todo_list: [],
  activityLog: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TODO: {
  const { id, task, title, dependentTaskId } = action.payload;
  const log = {
    type: "Added Task",
    id,
    title,
    task,
    dependentTaskId
  };

  return {
    ...state,
    todo_list: [...state.todo_list, { id, task, title, dependentTaskId }],
    activityLog: [log, ...(Array.isArray(state.activityLog) ? state.activityLog : [])],
  };
}

    case UPDATE_TODO: {
      const { id, task, title, dependentTaskId} = action.payload;
      const log = {
        type: "Updated Task",
        id,
        title,
        task,
        dependentTaskId
      };

      return {
        ...state,
        todo_list: state.todo_list.map((todo) => {
          if (todo.id === id) {
            return { ...todo, task, title, dependentTaskId };
          }
          return todo;
        }),
        activityLog: [log, ...(Array.isArray(state.activityLog) ? state.activityLog : [])],
      };
    }

    case DELETE_TODO: {
      const { id } = action.payload;
      const deletedTodo = state.todo_list.find((todo) => todo.id === id);
      const log = {
        type: "Deleted Task",
        id,
        title: deletedTodo.title,
        task: deletedTodo.task,
      };

      return {
        ...state,
        todo_list: state.todo_list.filter((todo) => todo.id !== id),
        activityLog: [log, ...(Array.isArray(state.activityLog) ? state.activityLog : [])],
      };
    }

    case ADD_TO_ACTIVITY_LOG: {
      return {
        ...state,
        activityLog: [
          {
            type: action.payload.type,
            id: action.payload.id,
            title: action.payload.title,
            task: action.payload.task,
          },
          ...state.activityLog,
        ],
      };
    }

    default:
      return state;
  }
}