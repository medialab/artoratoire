import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import './RecorderContainer.scss';
import AudioVisualizer from '../../components/AudioVisualizer/AudioVisualizer';

import {saveRecording, getRecordings, clearRecordings} from './actions';
import {dataURLtoBlob} from '../../utils/blobConverter';

class RecorderContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blobURL: null,
      isRecording: false,
      saveRecording: false,
      audioElement: null
    };
  }
  componentDidMount() {
    this.props.actions.getRecordings();
  }

  startRecording = () => {
    this.setState({
      isRecording: true
    });
  };

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
    // this.setState({
    //   blobURL : blobObject.blobURL
    // });
    const recordingsCount = this.props.recordings.list.filter((item) => {
      return item.refSpeech === this.props.selectedSpeech.file_name;
    }).length;

    blobObject = {...blobObject, refSpeech: this.props.selectedSpeech.file_name};
    if (this.state.saveRecording) {
      this.props.actions.saveRecording(blobObject, recordingsCount);
    }
  };

  render() {
    return (
      this.props.selectedSpeech.file_name ?
        <div className="arot-RecorderContainer">
        {/*<div className="tabs is-fullwidth">
            <ul>
              <li className="is-active"><a>Record</a></li>
              <li><a>Compare</a></li>
            </ul>
          </div>*/}
          <div>
            <AudioVisualizer
              className="oscilloscope"
              record={this.state.isRecording}
              backgroundColor="#eee"
              visualSetting="frequencyBars"
              audioBitsPerSecond={128000}
              onStop={this.onStop}
              strokeColor="#000000" />
            <div>
              <button className="button" onClick={this.startRecording}>start</button>
              <button className="button" onClick={this.saveRecording}>stop/save</button>
              <button className="button" onClick={this.props.actions.clearRecordings}>clear</button>
            </div>
            <audio controls="controls" src={this.state.blobURL}></audio>

          </div>
          <ul className="aort-RecordingsItem">
            {
              this.props.recordings.list
              .filter((item) => {
                return item.refSpeech === this.props.selectedSpeech.file_name;
              })
              .map((item, i) => {
                const playRecording = () => {
                  const blob = dataURLtoBlob(item.dataUrl);
                  this.setState({
                    blobURL: window.URL.createObjectURL(blob)
                  });
                };
                return (
                  <li key={i} onClick={playRecording}>
                    <span>{item.title}</span>
                  </li>
                );
              })
            }
          </ul>
          {/*<div>
            <AudioVisualizer
              className="oscilloscope"
              record={this.state.record}
              backgroundColor="#eee"
              visualSetting="sinewave"
              audioElem={document.querySelector('.selectedAudio')}
              audioBitsPerSecond={128000}
              strokeColor="#000000" />
          </div>*/}
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
    recordings: state.recordings
  }),
  dispatch => ({
    actions: bindActionCreators({
      saveRecording,
      getRecordings,
      clearRecordings
    }, dispatch)
  })
)(RecorderContainer);
