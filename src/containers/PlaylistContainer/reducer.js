import {SELECT_CATEGORY, SELECT_SPEECH, SAVE_USER_SPEECHES, INIT_USER_SPEECHES} from './actions';

const initialPlaylistState = {
  selectedCategory: {},
  selectedSpeech: {},
  userSpeeches: {
    label: 'My Speeches',
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

    default:
      return state;
  }
}
