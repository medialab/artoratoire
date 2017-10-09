import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MicRecorder} from './MicRecorder';
import AudioContext from './AudioContext';
import Visualizer from './Visualizer';

import './StreamingWave.scss';


export default class StreamingWave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analyser: null,
      micRecorder: null,
      audioCtx: null,
      canvas: null,
      canvasCtx: null
    };
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
  }

  componentDidMount() {
    const canvas = this.node;
    const canvasCtx = canvas.getContext('2d');
    const analyser = AudioContext.getAnalyser();

    const {audioBitsPerSecond, mimeType} = this.props;
    const options = {
      audioBitsPerSecond,
      mimeType
    };

    this.setState({
      analyser,
      audioCtx: AudioContext,
      micRecorder: new MicRecorder(this.handleStart, this.handleStop, options),
      canvas,
      canvasCtx
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
    this.visualize();
  }


  visualize() {
    const {backgroundColor, strokeColor, width, height} = this.props;
    const {canvas, canvasCtx, audioCtx} = this.state;
    Visualizer.visualizeStreamingWave(audioCtx, canvasCtx, canvas, width, height, backgroundColor, strokeColor);
  }

  initCanvas() {
    const {width, height, backgroundColor} = this.props;
    const canvas = this.node;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.fillStyle = backgroundColor;
  }

  render() {
    const {width, height} = this.props;

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
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  strokeColor: '#000000',
  className: 'visualizer',
  audioBitsPerSecond: 48000,
  mimeType: 'audio/mpeg',
  isRecording: false,
  width: 960,
  height: 200,
};
