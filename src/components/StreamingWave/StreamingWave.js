import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MicRecorder} from './MicRecorder';
import AudioContext from './AudioContext';
import Visualizer from './Visualizer';
import {CANVAS_HEIGHT, BAR_WIDTH, BAR_GUTTER} from '../../constants/CanvasConstants';
import {sampleProps} from '../../utils/audioMeasure';
import './StreamingWave.scss';


export default class StreamingWave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      micRecorder: null,
      audioCtx: null,
      width: null,
      bars: []
    };
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
  }

  componentDidMount() {
    const {audioBitsPerSecond, mimeType} = this.props;
    const options = {
      audioBitsPerSecond,
      mimeType
    };

    const canvas = this.node;

    this.setState({
      audioCtx: AudioContext,
      micRecorder: new MicRecorder(this.handleStart, this.handleStop, options),
      width: canvas.parentNode.offsetWidth
    }, () => {
      this.state.micRecorder.setupRecorder();
    });
  }

  componentWillReceiveProps(nextProps) {
    const {isRecording, speech} = nextProps;
    const {micRecorder} = this.state;
    if (isRecording) {
      if (micRecorder) {
        micRecorder.startRecording();
      }
    }
    else {
      if (micRecorder) {
        micRecorder.stopRecording();
      }
      this.setState({
        bars: []
      });
    }
    if (speech.label !== this.props.speech.label) {
      this.initCanvas();
    }
  }

  handleStop(blob) {
    const {onStop} = this.props;
    onStop(blob);
  }

  handleStart() {
    // this.visualize();
    this.setupWaveform();
  }

  initCanvas() {
    const {height, backgroundColor} = this.props;
    const {width} = this.state;
    const canvas = this.node;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.fillStyle = backgroundColor;
  }

  // Render the bars
  renderBars = (bars) => {
    const {backgroundColor, strokeColor, height} = this.props;
    const {width} = this.state;
    const canvas = this.node;
    const canvasCtx = canvas.getContext('2d');

    const barWidth = BAR_WIDTH;
    const barGutter = BAR_GUTTER;
    const halfHeight = canvas.offsetHeight / 2;

    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.fillStyle = backgroundColor;
    canvasCtx.fillRect(0, 0, width, height);
    canvasCtx.fillStyle = strokeColor;

    window.requestAnimationFrame(() => {
      bars.forEach((bar, i) => {
        canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.max);
        canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.min);
      });
    });
  };

  // Process the microphone input
  processInput = (e) => {
    const {isRecording} = this.props;
    const {bars, width} = this.state;
    const barWidth = BAR_WIDTH;
    const barGutter = BAR_GUTTER;

    if (isRecording) {
      const array = new Float32Array(e.inputBuffer.getChannelData(0)); //4096
      bars.push(sampleProps(array, 0));
      if (bars.length <= Math.floor(width / (barWidth + barGutter))) {
        this.renderBars(bars);
      }
      else {
        this.renderBars(bars.slice(bars.length - Math.floor(width / (barWidth + barGutter))), bars.length);
      }
    }
  };

  // Setup the canvas to draw the waveform
  setupWaveform = () => {
    const {audioCtx} = this.state;

    const context = audioCtx.getAudioContext();
    const analyser = audioCtx.getAnalyser();
    const scriptProcessor = audioCtx.getScriptProcessor();

    analyser.connect(scriptProcessor);
    scriptProcessor.connect(context.destination);
    scriptProcessor.onaudioprocess = this.processInput;
  };

  render() {
    const {height} = this.props;
    const {width} = this.state;

    return (
      <canvas ref={node => this.node = node} height={height} width={width}></canvas>
    );
  }
}


StreamingWave.contextTypes = {
  t: PropTypes.func.isRequired
};
StreamingWave.propTypes = {};

StreamingWave.defaultProps = {
  backgroundColor: '#eee',
  strokeColor: '#000000',
  audioBitsPerSecond: 128000,
  mimeType: 'audio/mpeg',
  isRecording: false,
  height: CANVAS_HEIGHT
};
