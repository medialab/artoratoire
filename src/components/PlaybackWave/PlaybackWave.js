import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './PlaybackWave.scss';

import {SAMPLE_RATE, THRESHOLD} from '../../constants/AudioConstants';
import {BAR_WIDTH, BAR_GUTTER, CANVAS_HEIGHT} from '../../constants/CanvasConstants';

import {sampleProps} from '../../utils/audioMeasure';

export default class PlaybackWave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: null
    };
    this.progressUpdate = this.progressUpdate.bind(this);
  }
  componentDidMount() {
    this.audio.addEventListener('timeupdate', this.progressUpdate);
    this.setState({
      width: this.canvas.parentNode.offsetWidth
    }, () => {
      this.loadWave(this.props.buffer);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.playing) {
      if (this.audio.ended) {
        this.loadWave(this.props.buffer);
      }
      this.audio.play();
    }
    else {
      this.audio.pause();
    }
    if (nextProps.src !== this.props.src) {
      this.clear();
      this.loadWave(nextProps.buffer);
    }
  }

  loadWave(buffer) {
    const {backgroundColor, strokeColor, height} = this.props;
    const width = this.props.width ? this.props.width : this.state.width;

    const canvas = this.canvas;
    const canvasCtx = canvas.getContext('2d');
    const halfHeight = canvas.offsetHeight / 2;
    const barWidth = BAR_WIDTH;
    const barGutter = BAR_GUTTER;

    canvasCtx.fillStyle = backgroundColor;
    canvasCtx.fillRect(0, 0, width, height);
    canvasCtx.fillStyle = strokeColor;

    const data = buffer.getChannelData(0);
    const step = SAMPLE_RATE;

    for (let i = 0; i < data.length / step; i ++) {
      const bar = sampleProps(data, i, step);
      // if (bar.rms > THRESHOLD) {
      canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.max);
      canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.min);
      // canvasCtx.fillRect(i * (barWidth + barGutter), (1 + min) * halfHeight, barWidth, Math.max(1, (max - min)) * halfHeight);
      // }
    }
  }

  progressUpdate () {
    const {highlightColor, onEnded, buffer} = this.props;

    const data = buffer.getChannelData(0);
    const step = SAMPLE_RATE;
    const currentBars = Math.floor(this.audio.currentTime * 48000 / step);
    const canvas = this.canvas;
    const canvasCtx = canvas.getContext('2d');
    const halfHeight = canvas.offsetHeight / 2;
    const barWidth = BAR_WIDTH;
    const barGutter = BAR_GUTTER;

    if (this.audio.ended) {
      onEnded();
    }

    window.requestAnimationFrame(() => {
      canvasCtx.fillStyle = highlightColor;

      for (let i = 0; i < currentBars; i ++) {
        const bar = sampleProps(data, i, step);
        // if (bar.rms > THRESHOLD) {
          // canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.rms);
        canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.max);
        canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.min);
          // canvasCtx.fillRect(i * (barWidth + barGutter), (1 + min) * halfHeight, barWidth, Math.max(1, (max - min)) * halfHeight);
        // }
      }
    });
  }

  clear() {
    const {height} = this.props;
    const width = this.props.width ? this.props.width : this.state.width;
    const canvas = this.canvas;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, width, height);
  }

  render() {
    const {height, src} = this.props;
    const width = this.props.width ? this.props.width : this.state.width;
    return (
      <div>
        <canvas ref={node => this.canvas = node} height={height} width={width}></canvas>
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
  backgroundColor: '#fff',
  strokeColor: '#A9A9A9',
  highlightColor: '#ff894d',
  height: CANVAS_HEIGHT
};
