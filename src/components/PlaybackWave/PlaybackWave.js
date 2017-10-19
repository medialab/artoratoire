import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './PlaybackWave.scss';

import {SAMPLE_RATE, THRESHOLD} from '../../constants/AudioConstants';
import {BAR_WIDTH, BAR_GUTTER, CANVAS_HEIGHT, BACKGROUND_COLOR, STROKE_MAX_COLOR, STROKE_MIN_COLOR, HIGHLIGHT_MAX_COLOR, HIGHLIGHT_MIN_COLOR} from '../../constants/CanvasConstants';

import {sampleProps} from '../../utils/audioMeasure';

export default class PlaybackWave extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   width: null
    // };
    this.progressUpdate = this.progressUpdate.bind(this);
  }
  componentDidMount() {
    this.audio.addEventListener('timeupdate', this.progressUpdate);
    // this.setState({
    //   width: this.canvas.parentNode.offsetWidth
    // }, () => {
    //   this.loadWave(this.props.buffer);
    // });
    this.loadWave(this.props.buffer);
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
    const {backgroundColor, strokeMaxColor, strokeMinColor, height, barWidth, barGutter} = this.props;
    // const width = this.props.width ? this.props.width : this.state.width;
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
      // if (bar.rms > THRESHOLD) {
      canvasCtx.fillStyle = strokeMaxColor;
      canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.max);
      canvasCtx.fillStyle = strokeMinColor;
      canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight + 2, barWidth, - halfHeight * bar.min);
      // canvasCtx.fillRect(i * (barWidth + barGutter), (1 + min) * halfHeight, barWidth, Math.max(1, (max - min)) * halfHeight);
      // }
    }
  }

  progressUpdate () {
    const {highlightMaxColor, highlightMinColor, onEnded, buffer, barWidth, barGutter} = this.props;

    const data = buffer.getChannelData(0);
    const step = SAMPLE_RATE;
    const currentBars = Math.floor(this.audio.currentTime * 48000 / step);
    const canvas = this.canvas;
    const canvasCtx = canvas.getContext('2d');
    const halfHeight = canvas.offsetHeight / 2;

    if (this.audio.ended) {
      onEnded();
    }

    window.requestAnimationFrame(() => {
      for (let i = 0; i < currentBars; i ++) {
        const bar = sampleProps(data, i, step);
        // if (bar.rms > THRESHOLD) {
          // canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.rms);
        canvasCtx.fillStyle = highlightMaxColor;
        canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * bar.max);
        canvasCtx.fillStyle = highlightMinColor;
        canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight + 2, barWidth, - halfHeight * bar.min);
          // canvasCtx.fillRect(i * (barWidth + barGutter), (1 + min) * halfHeight, barWidth, Math.max(1, (max - min)) * halfHeight);
        // }
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
  strokeMaxColor: STROKE_MAX_COLOR,
  strokeMinColor: STROKE_MIN_COLOR,
  highlightMaxColor: HIGHLIGHT_MAX_COLOR,
  highlightMinColor: HIGHLIGHT_MIN_COLOR,
  height: CANVAS_HEIGHT,
  barWidth: BAR_WIDTH,
  barGutter: BAR_GUTTER
};
