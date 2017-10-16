import AudioContext from './AudioContext';

const constraints = {audio: true, video: false}; // constraints - only audio needed

export class MicRecorder {
  constructor(onStart, onStop, options) {
    this.onStartCallback = onStart;
    this.onStopCallback = onStop;
    this.options = options;

    this.mediaRecorder = null;
    this.chunks = [];
    this.startTime = null;
  }

  setupRecorder() {
    if (navigator.mediaDevices) {
      console.log('getUserMedia supported.');
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        const audioCtx = AudioContext.getAudioContext();
        const analyser = AudioContext.getAnalyser();

        this.mediaRecorder = new window.MediaRecorder(stream);

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        this.mediaRecorder.onstop = () => this.onStop();
        this.mediaRecorder.ondataavailable = (event) => {
          this.chunks.push(event.data);
        };
      });
    }
    else {
      alert('Your browser does not support audio recording');
    }
  }

  startRecording() {
    this.startTime = Date.now();
    this.mediaRecorder.start();
    if (this.onStartCallback) this.onStartCallback();
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      // audioCtx.suspend();
    }
  }

  onStop() {
    const blob = new Blob(this.chunks, {type: this.options.mimeType});
    this.chunks = [];
    const blobObject = {
      blob,
      startTime: this.startTime,
      stopTime: Date.now(),
      options: this.options,
      blobURL: window.URL.createObjectURL(blob)
    };

    if (this.onStopCallback) this.onStopCallback(blobObject);
  }
}
