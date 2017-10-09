import axios from 'axios';
import textExtractor from '../../utils/textExtractor';

// Actions

export const GET_SPEECH_LIST = 'GET_SPEECH_LIST';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SELECT_SPEECH = 'SELECT_SPEECH';

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
export const selectCategory = category => {
  return dispatch => {
    dispatch(selectSpeech(category.list[0]));
    dispatch({type: SELECT_CATEGORY, category});
  };
};
