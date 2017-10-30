import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './PlaybackWave.scss';

import {SAMPLE_RATE, THRESHOLD} from '../../constants/AudioConstants';
import {BAR_WIDTH, BAR_GUTTER, CANVAS_HEIGHT, BACKGROUND_COLOR, STROKE_COLOR, HIGHLIGHT_COLOR, HIGHLIGHT_SILENCE_COLOR} from '../../constants/CanvasConstants';

import {sampleProps} from '../../utils/audioMeasure';

export default class PlaybackWave extends Component {
  constructor(props) {
    super(props);
    this.progressUpdate = this.progressUpdate.bind(this);
    this.audioEnd = this.audioEnd.bind(this);
  }
  componentDidMount() {
    this.audio.ontimeupdate = this.progressUpdate;
    this.audio.onended = this.audioEnd;
    this.loadWave(this.props.buffer);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPlaying && nextProps.isPlaying !== this.props.isPlaying) {
      if (this.props.isEnded) {
        this.clear();
        this.loadWave(this.props.buffer);
      }
      this.audio.play();
    }
    if (!nextProps.isPlaying && nextProps.isPlaying !== this.props.isPlaying) {
      this.audio.pause();
    }
    if (nextProps.src !== this.props.src) {
      this.clear();
      this.loadWave(nextProps.buffer);
    }
  }

  audioEnd () {
    const {onEnded} = this.props;
    onEnded();
  }

  loadWave(buffer) {
    const {backgroundColor, strokeColor, height, barWidth, barGutter} = this.props;
    const canvas = this.canvas;
    const canvasCtx = canvas.getContext('2d');

    const data = buffer.getChannelData(0);
    const width = Math.ceil((data.length / SAMPLE_RATE) * (BAR_WIDTH + BAR_GUTTER));

    canvas.width = width;
    canvas.height = height;

    const halfHeight = canvas.offsetHeight / 2;

    canvasCtx.fillStyle = backgroundColor;
    canvasCtx.fillRect(0, 0, width, height);

    const step = SAMPLE_RATE;
    for (let i = 0; i < data.length / step; i ++) {
      const bar = sampleProps(data, i, step);
      if (bar.rms > THRESHOLD) {
        canvasCtx.fillStyle = strokeColor;
        canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.max);
        canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.min);
      }
    }
  }

  progressUpdate () {
    const {highlightColor, silenceColor, buffer, barWidth, barGutter, onTimeProgress, isPlaying} = this.props;
    const data = buffer.getChannelData(0);
    const step = SAMPLE_RATE;
    const currentBars = Math.ceil(this.audio.currentTime * 48000 / step);
    const canvas = this.canvas;
    const canvasCtx = canvas.getContext('2d');
    const halfHeight = canvas.offsetHeight / 2;

    if (isPlaying) onTimeProgress(this.audio.currentTime);

    window.requestAnimationFrame(() => {
      for (let i = 0; i < currentBars; i ++) {
        const bar = sampleProps(data, i, step);
        if (bar.rms > THRESHOLD) {
          canvasCtx.fillStyle = highlightColor;
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.max);
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.min);
        }
        else {
          canvasCtx.fillStyle = silenceColor;
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * THRESHOLD);
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, halfHeight * THRESHOLD);
        }
      }
    });
  }

  clear() {
    const canvas = this.canvas;
    const canvasCtx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    canvasCtx.clearRect(0, 0, width, height);
  }

  render() {
    const {src} = this.props;

    return (
      <div>
        <canvas ref={node => this.canvas = node}></canvas>
        <audio ref={node => this.audio = node} src={src}></audio>
      </div>
    );
  }
}

PlaybackWave.contextTypes = {
  t: PropTypes.func.isRequired
};
PlaybackWave.propTypes = {};

PlaybackWave.defaultProps = {
  backgroundColor: BACKGROUND_COLOR,
  strokeColor: STROKE_COLOR,
  highlightColor: HIGHLIGHT_COLOR,
  silenceColor: HIGHLIGHT_SILENCE_COLOR,
  height: CANVAS_HEIGHT,
  barWidth: BAR_WIDTH,
  barGutter: BAR_GUTTER
};
