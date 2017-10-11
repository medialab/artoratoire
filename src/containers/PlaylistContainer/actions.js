import axios from 'axios';
import textExtractor from '../../utils/textExtractor';
import uuid from 'uuid';

// Actions

export const GET_SPEECH_LIST = 'GET_SPEECH_LIST';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SELECT_SPEECH = 'SELECT_SPEECH';
export const SELECT_USER_SPEECH = 'SELECT_USER_SPEECH';

export const SAVE_USER_SPEECHES = 'SAVE_USER_SPEECHES';
export const GET_USER_SPEECHES = 'GET_USER_SPEECHES';
export const INIT_USER_SPEECHES = 'INIT_USER_SPEECHES';


const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Action creators
function getSpeechText(speech) {
  return axios.get(`../../speech_material/${speech.file_name}.txt`);
}

function getSpeechAudio(speech) {
  return axios({
    method: 'get',
    url: `../../speech_material/${speech.file_name}.mp3`,
    responseType: 'arraybuffer'
  });
}

export const selectSpeech = speech => {
  return dispatch => {
    axios.all([getSpeechText(speech), getSpeechAudio(speech)])
    .then(axios.spread((text, audio) => {
      const content = textExtractor(text.data, speech.lang);
      audioContext.decodeAudioData(audio.data, buffer => {
        speech = {
          ...speech,
          ...content,
          buffer
        };
        dispatch({type: SELECT_SPEECH, speech});
      });

    }));
  };
};

export const selectUserSpeech = speech => {
  return dispatch => {
    const content = textExtractor(speech.content, speech.lang, false);
     speech = {
        ...speech,
        ...content
      };
    dispatch({type: SELECT_USER_SPEECH, speech});
  };
};

export const selectCategory = category => {
  return dispatch => {
    if (category.value === 'mySpeeches') {
      dispatch(selectUserSpeech(category.list[0]));
    }
    else
      dispatch(selectSpeech(category.list[0]));
    dispatch({type: SELECT_CATEGORY, category});
  };
};

export const saveUserSpeeches = speech => {
  speech = {
    ...speech,
    id: uuid.v4()
  };
  return (dispatch, getState) => {
    dispatch({type: SAVE_USER_SPEECHES, speech});
    const category = getState().playlist.userSpeeches;
    dispatch(selectCategory(category));
  };
};

export const getUserSpeeches = () => {
  return dispatch => {
    dispatch({type: GET_USER_SPEECHES});
  };
};

