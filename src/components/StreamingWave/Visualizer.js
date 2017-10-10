import {min, max} from 'lodash';

const Visualizer = {
  visualizeStreamingWave (audioContext, canvasCtx, canvas, width, height, backgroundColor, strokeColor) {
    let bars = [];
    let drawing = false;
    const barWidth = 1;
    const barGutter = 1;
    const halfHeight = canvas.offsetHeight / 2;

    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.fillStyle = backgroundColor;
    canvasCtx.fillRect(0, 0, width, height);
    canvasCtx.fillStyle = strokeColor;

    const analyser = audioContext.getAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.3;

    // Render the bars
    const renderBars = (bars) => {
      window.requestAnimationFrame(() => {
        bars.forEach((bar, i) => {
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.max);
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.min);
          // canvasCtx.fillRect(i * (barWidth + barGutter), (1 + bar.min) * halfHeight, barWidth, (bar.max - bar.min) * halfHeight);
        });
      });
    };

    // Process the microphone input
    const processInput = (e) => {
      // const array = new Uint8Array(analyser.frequencyBinCount); //512
      // analyser.getByteFrequencyData(array);
      // const array = new Uint8Array(analyser.fftSize); //1024
      // analyser.getByteTimeDomainData(array);
      const array = new Float32Array(e.inputBuffer.getChannelData(0)); //4096
      // bars.push(this.getAverageVolume(array));
      bars.push(this.getPeaks(array));
      if (bars.length <= Math.floor(width / (barWidth + barGutter))) {
        renderBars(bars);
      }
      else {
        renderBars(bars.slice(bars.length - Math.floor(width / (barWidth + barGutter))), bars.length);
      }
    };

    // Setup the canvas to draw the waveform
    const setupWaveform = () => {
      const context = audioContext.getAudioContext();
      const scriptProcessor = audioContext.getScriptProcessor();

      analyser.connect(scriptProcessor);
      scriptProcessor.connect(context.destination);
      scriptProcessor.onaudioprocess = processInput;
    };

    setupWaveform();
  },

  getPeaks(array) {
    return {
      min: min(array),
      max: max(array)
    };
  },
  // Calculate the average volume
  getAverageVolume(array) {
    const length = array.length;
    let values = 0;
    let i = 0;

    for (; i < length; i++) {
      values += array[i];
    }
    return values / length;
  }
};

export default Visualizer;
