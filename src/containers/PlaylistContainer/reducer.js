import {SELECT_CATEGORY, SELECT_SPEECH, GET_SPEECH_TEXT} from './actions';

const initialPlaylistState = {
  selectedCategory: {},
  selectedSpeech: '',
  speechText: ''
};

// Reducer
export default function playlist(state = initialPlaylistState, action) {
  switch (action.type) {
    case SELECT_CATEGORY:
      return Object.assign({}, state, {
        selectedCategory: action.category
      });
    case SELECT_SPEECH:
      return Object.assign({}, state, {
        selectedSpeech: action.text
      });
    case GET_SPEECH_TEXT:
      return Object.assign({}, state, {
        speechText: action.text
      });
    default:
      return state;
  }
}
