import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './PlaybackWave.scss';
const THRESHOLD = 0.02;

export default class PlaybackWave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioContext: new (window.AudioContext || window.webkitAudioContext)(),
      source: null,
      analyser: null,
      scriptProcessor: null
    };
    this.progressUpdate = this.progressUpdate.bind(this);
  }
  componentDidMount() {
    const {audioContext} = this.state;

    this.setState({
      source: audioContext.createBufferSource(),
      analyser: audioContext.createAnalyser(),
      scriptProcessor: audioContext.createScriptProcessor(4096, 1, 1)
    }, () => {
      this.state.source.connect(audioContext.destination);
      this.state.source.connect(this.state.analyser);
      this.state.analyser.connect(this.state.scriptProcessor);
      this.state.scriptProcessor.connect(audioContext.destination);
      this.state.source.onended = this.props.onEnded;
    });
    this.loadWave(this.props.buffer);
   // this.audio.addEventListener('timeupdate', this.progressUpdate);
  }
  componentWillReceiveProps(nextProps) {
    const {buffer, playing} = nextProps;
    if (playing) {
      // if (this.audio.ended) {
      //   this.loadWave(this.props.buffer);
      // }
      this.state.source.buffer = buffer;
      this.state.source.start();
      this.state.scriptProcessor.onaudioprocess = this.progressUpdate;

      // this.audio.play();
    }
    else {
      this.state.source.stop();
      // this.audio.pause();
    }
    if (nextProps.src !== this.props.src) {
      this.clear();
      this.loadWave(buffer);
    }
  }

  loadWave(buffer) {
    const {backgroundColor, strokeColor, width, height} = this.props;
    const canvas = this.canvas;
    const canvasCtx = canvas.getContext('2d');
    const halfHeight = canvas.offsetHeight / 2;

    canvasCtx.fillStyle = backgroundColor;
    canvasCtx.fillRect(0, 0, width, height);
    canvasCtx.fillStyle = strokeColor;
    const barWidth = 1;
    const barGutter = 1;

    const data = buffer.getChannelData(0);
    const step = 4096;
    for (let i = 0; i < data.length / step; i ++) {
      let min = 1.0;
      let max = -1.0;
      let values = 0;
      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j];
        values += datum;
        if (datum < min)
          min = datum;
        if (datum > max)
          max = datum;
      }
      const average = values / step;
      if (max > THRESHOLD) {
        canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * max);
        canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * min);
        // canvasCtx.fillRect(i * (barWidth + barGutter), (1 + min) * halfHeight, barWidth, Math.max(1, (max - min)) * halfHeight);
      }
    }
  }

  progressUpdate () {
    const {highlightColor, onEnded} = this.props;
    const {audioContext, source} = this.state;
    console.log(audioContext.currentTime);
    const data = this.props.buffer.getChannelData(0);
    const step = 4096;
    const currentBars = Math.floor(audioContext.currentTime * 48000 / step);
    const canvas = this.canvas;
    const canvasCtx = canvas.getContext('2d');
    const halfHeight = canvas.offsetHeight / 2;
    const barWidth = 1;
    const barGutter = 1;
    // if (this.audio.ended) {
    //   onEnded();
    // }

    window.requestAnimationFrame(() => {
      canvasCtx.fillStyle = highlightColor;

      for (let i = 0; i < currentBars; i ++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
          const datum = data[(i * step) + j];
          if (datum < min)
            min = datum;
          if (datum > max)
            max = datum;
        }
        if (max > THRESHOLD) {
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * max);
          canvasCtx.fillRect(i * (barWidth + barGutter), halfHeight, barWidth, - halfHeight * min);
          // canvasCtx.fillRect(i * (barWidth + barGutter), (1 + min) * halfHeight, barWidth, Math.max(1, (max - min)) * halfHeight);
        }
      }
    });
  }

  clear() {
    const {width, height} = this.props;
    const canvas = this.canvas;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, width, height);
  }

  render() {
    const {width, height, src} = this.props;
    return (
      <div>
        <canvas ref={node => this.canvas = node} height={height} width={width}></canvas>
        {/* <audio ref={node => this.audio = node} src={src}></audio>*/}
      </div>
    );
  }
}

PlaybackWave.contextTypes = {
  t: PropTypes.func.isRequired
};
PlaybackWave.propTypes = {};

PlaybackWave.defaultProps = {
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  strokeColor: '#000000',
  highlightColor: '#ff894d',
  width: 1600,
  height: 200
};