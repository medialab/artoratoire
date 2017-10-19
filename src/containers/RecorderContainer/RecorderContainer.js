import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import './RecorderContainer.scss';
import StreamingWave from '../../components/StreamingWave/StreamingWave';
import {saveTrial, selectTrial} from '../TrialsContainer/actions';
import {blobToBuffer} from '../../utils/blobConverter';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

class RecorderContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableRecorder: false,
      isRecording: false,
      saveRecording: false,
      countdown: 2
    };
  }

  startRecording = () => {
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
    const {saveTrial, selectTrial} = this.props.actions;
    const trialsCount = this.props.trials.list.filter((item) => {
      return item.refSpeech === this.props.selectedSpeech.label;
    }).length;

    blobObject = {...blobObject, refSpeech: this.props.selectedSpeech.label};
    if (this.state.saveRecording) {
      saveTrial(blobObject, trialsCount);
      blobToBuffer(blobObject.blob, data => {
        audioContext.decodeAudioData(data, function(buffer) {
          const trial = {
            ...blobObject,
            buffer
          };
          selectTrial(trial);
        });
      });
    }
  }

  render() {
    const {enableRecorder, isRecording, countdown} = this.state;
    return (
      <div className="aort-RecorderContainer">
        <StreamingWave
          isRecording={isRecording}
          enableRecorder={enableRecorder}
          onEnable={this.startRecording}
          onStop={this.onStop}
          speech={this.props.selectedSpeech} />
        <div className="level">
          <div className="level-item is-centered">
            {
              // this.state.isRecording ?
              //   null :
                <a className="level-item button circle-button is-primary is-large" onClick={enableRecorder ? this.startRecording : this.activeRecorder} disabled={isRecording}>
                  <span className="icon is-small">
                    {
                      countdown === 2 ?
                        <i className="fa fa-microphone"></i> : <i>{countdown + 1}</i>
                    }
                  </span>
                </a>
            }
            {
              isRecording ?
                <a className="level-item button circle-button" onClick={this.saveRecording}>
                  <span className="icon is-small">
                    <i className="fa fa-sm fa-stop"></i>
                  </span>
                </a>
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
      selectTrial
    }, dispatch)
  })
)(RecorderContainer);
