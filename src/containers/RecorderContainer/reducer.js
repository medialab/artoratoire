import {SAVE_RECORDING, CLEAR_RECORDINGS, INIT_RECORDINGS, EXCEED_MAX_STORAGE} from './actions';

const initialRecordingState = {
  recording: null,
  list: [],
  count: 0,
  reachMaxQuota: false
};

export default function(state = initialRecordingState, action) {
  switch (action.type) {

    case SAVE_RECORDING: {
      const newList = state.list.slice();
      newList.splice(0, 0, action.recording);

      return {
        ...state,
        recording: action.recording,
        list: newList,
        count: state.count + 1
      };
    }

    case INIT_RECORDINGS:
      return {
        ...state,
        list: action.list,
        count: action.list.length
      };

    case CLEAR_RECORDINGS:
      return initialRecordingState;

    case EXCEED_MAX_STORAGE:
      return {
        ...state,
        reachMaxQuota: true
      };

    default:
      return state;
  }
}

