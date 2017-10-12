import {SAMPLE_RATE} from '../../constants/AudioConstants';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const scriptProcessor = audioCtx.createScriptProcessor(SAMPLE_RATE, 1, 1);

const AudioContext = {

  getAudioContext() {
    return audioCtx;
  },

  getAnalyser() {
    return analyser;
  },
  getScriptProcessor() {
    return scriptProcessor;
  }

};

export default AudioContext;
