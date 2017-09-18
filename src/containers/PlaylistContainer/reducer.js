import {SELECT_CATEGORY, SELECT_SPEECH} from './actions';

const initialPlaylistState = {
  selectedCategory: {},
  selectedSpeech: {}
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
    default:
      return state;
  }
}
