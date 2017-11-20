import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './PlaybackWave.scss';

import {SAMPLE_RATE, THRESHOLD} from '../../constants/AudioConstants';
import {BAR_WIDTH, BAR_GUTTER, CANVAS_HEIGHT, BACKGROUND_COLOR, STROKE_COLOR, SPEAKING_COLOR, SHORT_SILENCE_COLOR, LONG_SILENCE_COLOR} from '../../constants/CanvasConstants';

export default class PlaybackWave extends Component {
  constructor(props) {
    super(props);
    this.progressUpdate = this.progressUpdate.bind(this);
    this.audioEnd = this.audioEnd.bind(this);
  }
  componentDidMount() {
    this.audio.ontimeupdate = this.progressUpdate;
    this.audio.onended = this.audioEnd;
    this.loadWave(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPlaying && nextProps.isPlaying !== this.props.isPlaying) {
      if (this.props.isEnded) {
        this.clear();
        this.loadWave(this.props.data);
      }
      this.audio.play();
    }
    if (!nextProps.isPlaying && nextProps.isPlaying !== this.props.isPlaying) {
      this.audio.pause();
    }
    if (nextProps.src !== this.props.src || nextProps.showCanvas !== this.props.showCanvas) {
      this.clear();
      this.loadWave(nextProps.data);
    }
  }

  audioEnd () {
    const {onEnded} = this.props;
    onEnded();
  }

  loadWave(data) {
    const {backgroundColor, speakingColor, strokeColor, shortSilenceColor, longSilenceColor, height, barWidth, barGutter} = this.props;
    const canvas = this.canvas;
    const canvasCtx = canvas.getContext('2d');

    const width = Math.ceil((data.length) * (BAR_WIDTH + BAR_GUTTER));
    canvas.width = width;
    canvas.height = height;

    const halfHeight = canvas.offsetHeight / 2;

    canvasCtx.fillStyle = backgroundColor;
    canvasCtx.fillRect(0, 0, width, height);

    data.forEach((d, i) => {
      if (d.label === 'speaking') {
        canvasCtx.fillStyle = strokeColor;
        canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * d.max);
        canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * d.min);
      }
    });
  }

  progressUpdate () {
    const {speakingColor, shortSilenceColor, longSilenceColor, data, barWidth, barGutter, onTimeProgress, isPlaying} = this.props;
    // const data = getSpeechData(buffer.getChannelData(0));
    const step = SAMPLE_RATE;
    const currentBars = Math.ceil(this.audio.currentTime * 48000 / step);
    const canvas = this.canvas;
    const canvasCtx = canvas.getContext('2d');
    const halfHeight = canvas.offsetHeight / 2;

    if (isPlaying) onTimeProgress(this.audio.currentTime);

    window.requestAnimationFrame(() => {
      for (let i = 0; i < currentBars; i ++) {
        if (data[i].label === 'speaking') {
          canvasCtx.fillStyle = speakingColor;
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * data[i].max);
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * data[i].min);
        }
        else if (data[i].label === 'short') {
          canvasCtx.fillStyle = shortSilenceColor;
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth + barGutter, - halfHeight * THRESHOLD);
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth + barGutter, halfHeight * THRESHOLD);
        }
        else {
          canvasCtx.fillStyle = longSilenceColor;
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth + barGutter, - halfHeight * THRESHOLD);
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth + barGutter, halfHeight * THRESHOLD);
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
  speakingColor: SPEAKING_COLOR,
  shortSilenceColor: SHORT_SILENCE_COLOR,
  longSilenceColor: LONG_SILENCE_COLOR,
  height: CANVAS_HEIGHT,
  barWidth: BAR_WIDTH,
  barGutter: BAR_GUTTER
};
