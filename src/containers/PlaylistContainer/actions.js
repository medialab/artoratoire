import axios from 'axios';

// Actions

export const GET_SPEECH_LIST = 'GET_SPEECH_LIST';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SELECT_SPEECH = 'SELECT_SPEECH';

// Action creators

export const selectSpeech = speech => {
  return dispatch => {
    axios.get('../../speech_material/' + speech.file_name + '.txt')
    .then(res => {
      speech = {
        ...speech,
        content: res.data
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
