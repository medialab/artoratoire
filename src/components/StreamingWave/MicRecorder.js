import AudioContext from './AudioContext';

let analyser;
let audioCtx;
let mediaRecorder;
let chunks = [];
let startTime;
let mediaOptions;
let onStartCallback;
let onStopCallback;

const constraints = {audio: true, video: false}; // constraints - only audio needed

export class MicRecorder {
  constructor(onStart, onStop, options) {
    onStartCallback = onStart;
    onStopCallback = onStop;
    mediaOptions = options;
  }

  setupRecorder() {
    if (navigator.mediaDevices) {
      console.log('getUserMedia supported.');
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        audioCtx = AudioContext.getAudioContext();
        analyser = AudioContext.getAnalyser();

        mediaRecorder = new window.MediaRecorder(stream);

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        mediaRecorder.onstop = this.onStop;
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };
      });
    }
    else {
      alert('Your browser does not support audio recording');
    }
  }

  startRecording() {
    startTime = Date.now();
    mediaRecorder.start();
    if (onStartCallback) onStartCallback();
  }

  stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      // audioCtx.suspend();
    }
  }

  onStop() {
    const blob = new Blob(chunks, {type: mediaOptions.mimeType});
    chunks = [];

    const blobObject = {
      blob,
      startTime,
      stopTime: Date.now(),
      options: mediaOptions,
      blobURL: window.URL.createObjectURL(blob)
    };

    if (onStopCallback) onStopCallback(blobObject);
  }
}
