
const Visualizer = {
  visualizeStreamingWave (audioContext, canvasCtx, canvas, width, height, backgroundColor, strokeColor) {
    let bars = [];
    let drawing = false;
    const barWidth = 2;
    const barGutter = 2;
    let halfHeight = 0;

    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.fillStyle = backgroundColor;
    canvasCtx.fillRect(0, 0, width, height);

    const analyser = audioContext.getAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.3;

    // Render the bars
    const renderBars = (bars) => {
      if (!drawing) {
        drawing = true;
        window.requestAnimationFrame(() => {
          canvasCtx.clearRect(0, 0, width, height);

          bars.forEach((bar, index) => {
            canvasCtx.fillStyle = strokeColor;
            canvasCtx.fillRect((index * (barWidth + barGutter)), halfHeight, barWidth, (halfHeight * (bar / 100)));
            canvasCtx.fillRect((index * (barWidth + barGutter)), (halfHeight - (halfHeight * (bar / 100))), barWidth, (halfHeight * (bar / 100)));
          });
          drawing = false;
        });
      }
    };

    // Process the microphone input
    const processInput = () => {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      bars.push(this.getAverageVolume(array));
      if (bars.length <= Math.floor(width / (barWidth + barGutter))) {
        renderBars(bars);
      }
      else {
        renderBars(bars.slice(bars.length - Math.floor(width / (barWidth + barGutter))), bars.length);
      }
    };

    // Setup the canvas to draw the waveform
    const setupWaveform = () => {
      halfHeight = canvas.offsetHeight / 2;
      const context = audioContext.getAudioContext();
      const scriptProcessor = audioContext.getScriptProcessor();

      analyser.connect(scriptProcessor);
      scriptProcessor.connect(context.destination);
      scriptProcessor.onaudioprocess = processInput;
    };

    setupWaveform();
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
