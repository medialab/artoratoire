import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import './RecorderContainer.scss';
import StreamingWave from '../../components/StreamingWave/StreamingWave';
import {saveTrial, selectTrial} from '../TrialsContainer/actions';
import {toggleSpeechWave} from '../PlaylistContainer/actions';
// import {blobToBuffer} from '../../utils/blobConverter';

// const audioContext = new (window.AudioContext || window.webkitAudioContext)();

class RecorderContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableRecorder: false,
      isRecording: false,
      saveRecording: false,
      countdown: 2,
      containerWidth: 960
    };
  }

  componentDidMount() {
    this.setState({
      containerWidth: this.container.offsetWidth
    });
  }

  startRecording = () => {
    this.props.actions.toggleSpeechWave(false);
    const int = setInterval(() => {
      if (this.state.countdown === 0) {
        this.setState({
          isRecording: true
        });
        clearInterval(int);
        this.setState({
          countdown: 2
        });
      }
      else {
        this.setState({
          countdown: this.state.countdown - 1
        });
      }
    }, 1000);
  }

  stopRecording = () => {
    this.setState({
      isRecording: false
    });
  }

  saveRecording = () => {
    this.setState({
      isRecording: false,
      saveRecording: true
    });
  }

  activeRecorder = () => {
    this.setState({
      enableRecorder: true
    });
  }

  onStop = (blobObject) => {
    const trialsCount = this.props.trials.list.filter((item) => {
      return item.refSpeech === this.props.selectedSpeech.label;
    }).length;

    blobObject = {...blobObject, refSpeech: this.props.selectedSpeech.label};
    if (this.state.saveRecording) {
      this.props.actions.saveTrial(blobObject, trialsCount);
      // blobToBuffer(blobObject.blob, data => {
      //   audioContext.decodeAudioData(data, function(buffer) {
      //     const trial = {
      //       ...blobObject,
      //       buffer
      //     };
      //     selectTrial(trial);
      //   });
      // });
    }
  }

  render() {
    const {enableRecorder, isRecording, countdown} = this.state;
    return (
      <div ref={node=> this.container = node} className="aort-Recorder container">
        <StreamingWave
          isRecording={isRecording}
          enableRecorder={enableRecorder}
          onEnable={this.startRecording}
          onStop={this.onStop}
          speech={this.props.selectedSpeech}
          width={this.state.containerWidth} />
        <div className="level">
          <div className="level-item is-centered">
            {
              isRecording ?
                null :
                <button className="level-item button circle-button is-primary is-large" onClick={enableRecorder ? this.startRecording : this.activeRecorder} disabled={isRecording}>
                  <span className="icon is-small">
                    {
                      countdown === 2 ?
                        <i className="fa fa-microphone"></i> : <i>{countdown + 1}</i>
                    }
                  </span>
                </button>
            }
            {
              isRecording ?
                <button className="level-item button circle-button is-large" onClick={this.saveRecording}>
                  <span className="icon is-small has-text-success">
                    <i className="fa fa-check"></i>
                  </span>
                </button>
                : null
            }
          </div>
        </div>
      </div>
    );
  }
}

RecorderContainer.contextTypes = {
  t: PropTypes.func.isRequired
};

export default connect(
  state => ({
    selectedSpeech: state.playlist.selectedSpeech,
    trials: state.trials
  }),
  dispatch => ({
    actions: bindActionCreators({
      saveTrial,
      selectTrial,
      toggleSpeechWave
    }, dispatch)
  })
)(RecorderContainer);
