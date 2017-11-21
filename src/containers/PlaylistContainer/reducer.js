import {SELECT_CATEGORY, SELECT_SPEECH, SAVE_USER_SPEECHES, INIT_USER_SPEECHES, CLEAR_SELECTED_SPEECH, TOGGLE_SPEECH_WAVE} from './actions';

const initialPlaylistState = {
  selectedCategory: {},
  selectedSpeech: {},
  showSpeechWave: true,
  userSpeeches: {
    label: 'my-speeches',
    value: 'mySpeeches',
    list: []
  }
};

// Reducer
export default function playlist(state = initialPlaylistState, action) {
  switch (action.type) {
    case SELECT_CATEGORY:
      return {
        ...state,
        selectedCategory: action.category
      };
    case SELECT_SPEECH:
      return {
        ...state,
        selectedSpeech: action.speech
      };
    case CLEAR_SELECTED_SPEECH:
      return {
        ...state,
        selectedSpeech: {},
        selectedCategory: {}
      };
    case SAVE_USER_SPEECHES:
      const newList = state.userSpeeches.list.slice();
      newList.splice(0, 0, action.speech);
      return {
        ...state,
        userSpeeches: {
          ... state.userSpeeches,
          list: newList
        }
      };
    case INIT_USER_SPEECHES:
      return {
        ...state,
        userSpeeches: {
          ...state.userSpeeches,
          list: action.speeches
        }
      };
    case TOGGLE_SPEECH_WAVE:
      return {
        ...state,
        showSpeechWave: action.showWave
      };

    default:
      return state;
  }
}
