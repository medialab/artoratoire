import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import './RecorderContainer.scss';
import StreamingWave from '../../components/StreamingWave/StreamingWave';
import {saveTrial, selectTrial} from '../TrialsContainer/actions';
import {blobToBuffer} from '../../utils/blobConverter';


class RecorderContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      saveRecording: false,
      audioElement: null
    };
  }

  startRecording = () => {
    this.setState({
      isRecording: true
    });
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

  onStop = (blobObject) => {
    const {saveTrial, selectTrial} = this.props.actions;
    const trialsCount = this.props.trials.list.filter((item) => {
      return item.refSpeech === this.props.selectedSpeech.file_name;
    }).length;

    blobObject = {...blobObject, refSpeech: this.props.selectedSpeech.file_name};
    if (this.state.saveRecording) {
      saveTrial(blobObject, trialsCount);

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      blobToBuffer(blobObject.blob, data => {
        audioContext.decodeAudioData(data, function(buffer) {
          const blob = {
            ...blobObject,
            buffer
          };
          selectTrial(blob);
        });
      });
    }
  }

  render() {
    return (
      this.props.selectedSpeech.file_name ?
        <div className="arot-RecorderContainer">
          <div>
            <StreamingWave
              className="oscilloscope"
              isRecording={this.state.isRecording}
              backgroundColor="#eee"
              audioBitsPerSecond={128000}
              onStop={this.onStop}
              strokeColor="#000000" />
          </div>
          <div>
            <div>
              <button className="button" onClick={this.startRecording}>start</button>
              <button className="button" onClick={this.saveRecording}>stop/save</button>
            </div>
          </div>

        </div> : null
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
