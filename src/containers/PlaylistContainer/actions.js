import axios from 'axios';
import textExtractor from '../../utils/textExtractor';
import {flatten} from 'lodash';

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
function getSpeechAligner(speech) {
  return axios.get(`../../speech_material/${speech.file_name}.json`);
}

export const selectSpeech = speech => {
  return dispatch => {
    axios.all([getSpeechText(speech), getSpeechAudio(speech), getSpeechAligner(speech)])
    .then(axios.spread((text, audio, json) => {
      const content = textExtractor(text.data, speech.lang);
      const aligner = flatten(json.data.map((d) => d.words))
                      .filter((d) => d.duration !== '0.00');
      audioContext.decodeAudioData(audio.data, buffer => {
        speech = {
          ...speech,
          ...content,
          buffer,
          aligner
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
