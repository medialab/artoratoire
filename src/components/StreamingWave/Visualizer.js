import {sampleProps} from '../../utils/audioMeasure';
import {BAR_WIDTH, BAR_GUTTER} from '../../constants/CanvasConstants';

const Visualizer = {
  visualizeStreamingWave (audioContext, canvasCtx, canvas, width, height, backgroundColor, strokeColor) {
    let bars = [];
    const barWidth = BAR_WIDTH;
    const barGutter = BAR_GUTTER;
    const halfHeight = canvas.offsetHeight / 2;

    const analyser = audioContext.getAnalyser();
    analyser.fftSize = 8192;
    analyser.smoothingTimeConstant = 0.3;

    // Render the bars
    const renderBars = (bars) => {
      canvasCtx.clearRect(0, 0, width, height);
      canvasCtx.fillStyle = backgroundColor;
      canvasCtx.fillRect(0, 0, width, height);
      canvasCtx.fillStyle = strokeColor;

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
      // const timearray = new Uint8Array(analyser.frequencyBinCount); //1024
      // analyser.getByteFrequencyData(timearray);
      // const array = new Uint8Array(analyser.fftSize); //2048
      // analyser.getByteTimeDomainData(array);
      const array = new Float32Array(e.inputBuffer.getChannelData(0)); //4096

      bars.push(sampleProps(array, 0));
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
  }
};

export default Visualizer;
