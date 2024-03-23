import { ADD_TODO, DELETE_TODO, UPDATE_TODO, ADD_TO_ACTIVITY_LOG, UPDATE_TOTAL_POINTS, UPDATE_STATUS_TODO } from "../actionTypes";

const initialState = {
  todo_list: [],
  activityLog: [],
  totalPoints: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TODO: {
      const { id, task, title, iteration, status, dependentTaskId, category } = action.payload;
      const points = 10;
      const log = {
        type: "Added Task",
        id,
        title,
        task,
        iteration,
        status,
        dependentTaskId,
        category,
        points
      };
      console.log(" [ 25 ] todo.js | ADD_TODO : ", log);
      return {
        ...state,
        todo_list: [...state.todo_list, { id, task, title, iteration, status, dependentTaskId, category, points }],
        activityLog: [log, ...(Array.isArray(state.activityLog) ? state.activityLog : [])]
      };
    }

    case UPDATE_TODO: {
      const { id, task, title, dependentTaskId } = action.payload;
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
        activityLog: [log, ...(Array.isArray(state.activityLog) ? state.activityLog : [])]
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
            status: action.payload.status
          },
          ...state.activityLog,
        ],
      };
    }

    case UPDATE_TOTAL_POINTS: {
      return {
        ...state,
        totalPoints: action.payload,
      };
    }

    case UPDATE_STATUS_TODO: {
      const { id, status } = action.payload
      const statusTodo = state.todo_list.find((todo) => todo.id === id);
      const log = {
        type: "Updated Status",
        id,
        title   : statusTodo.title,
        task    : statusTodo.task,
        status  : statusTodo.status,
      }
      return {
        ...state,
        todo_list: state.todo_list.map((todo) => {
          if (todo.id === id) {
            return { ...todo, status }
          }
          return todo
        }),
        activityLog: [log, ...(Array.isArray(state.activityLog) ? state.activityLog : [])]
      }
    }

    default:
      return state;
  }
}

