import axios from 'axios';

// Actions

export const GET_SPEECH_LIST = 'GET_SPEECH_LIST';
export const GET_SPEECH_TEXT = 'GET_SPEECH_TEXT';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SELECT_SPEECH = 'SELECT_SPEECH';

// Action creators
export const getSpeechText = name => {
  return dispatch => {
    axios.get('../../speech_material/' + name + '.txt')
    .then(res => {
      const text = res.data;
      dispatch({type: GET_SPEECH_TEXT, text});
    });
  };
};

export const selectSpeech = speech => {
  const text = speech.label;
  return dispatch => {
    dispatch(getSpeechText(speech.file_name));
    dispatch({type: SELECT_SPEECH, text});
  };
};
export const selectCategory = category => {
  return dispatch => {
    dispatch(selectSpeech(category.list[0]));
    dispatch({type: SELECT_CATEGORY, category});
  };
};
