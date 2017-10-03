import axios from 'axios';
import textExtractor from '../../utils/textExtractor';

// Actions

export const GET_SPEECH_LIST = 'GET_SPEECH_LIST';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SELECT_SPEECH = 'SELECT_SPEECH';

// Action creators

export const selectSpeech = speech => {
  return dispatch => {
    axios.get('../../speech_material/' + speech.file_name + '.txt')
    .then(res => {
      const content = textExtractor(res.data, speech.lang);
      speech = {
        ...speech,
        ...content
      };
      dispatch({type: SELECT_SPEECH, speech});
    });
  };
};
export const selectCategory = category => {
  return dispatch => {
    dispatch(selectSpeech(category.list[0]));
    dispatch({type: SELECT_CATEGORY, category});
  };
};
