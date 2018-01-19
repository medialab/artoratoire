export const SAMPLE_RATE = 4096;
export const THRESHOLD = 0.01;

const  AudioContext = window.AudioContext || window.webkitAudioContext
export const SEC_BUFFER = new AudioContext().sampleRate;
export const MIN_DURATION = 0.3;
