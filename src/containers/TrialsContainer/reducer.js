import {SAVE_TRIAL, DELETE_TRIAL, SELECT_TRIAL, CLEAR_TRIALS, INIT_TRIALS, EXCEED_MAX_STORAGE} from './actions';

const initialTrialState = {
  selectedTrial: null,
  list: [],
  reachMaxQuota: false
};

export default function(state = initialTrialState, action) {
  switch (action.type) {

    case SAVE_TRIAL: {
      const newList = state.list.slice();
      newList.splice(0, 0, action.trial);
      return {
        ...state,
        list: newList
      };
    }

    case DELETE_TRIAL: {
      const list = state.list.filter((trial) => {
        return trial.id !== action.id;
      });
      return {
        ...state,
        list
      };
    }

    case SELECT_TRIAL: {
      return {
        ...state,
        selectedTrial: action.trial
      };
    }

    case INIT_TRIALS:
      return {
        ...state,
        list: action.list
      };

    case CLEAR_TRIALS:
      return initialTrialState;

    case EXCEED_MAX_STORAGE:
      return {
        ...state,
        reachMaxQuota: true
      };

    default:
      return state;
  }
}

