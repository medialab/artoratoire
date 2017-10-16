import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {SAMPLE_RATE} from '../../constants/AudioConstants';
import {BAR_WIDTH, BAR_GUTTER} from '../../constants/CanvasConstants';

import './TrialsContainer.scss';
import {getTrials, deleteTrial, selectTrial} from './actions';
import {setUserSpeechAudio} from '../PlaylistContainer/actions';
import {dataURLtoBlob, blobToBuffer} from '../../utils/blobConverter';
import PlaybackWave from '../../components/PlaybackWave/PlaybackWave';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

class TrialsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false
    };
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.onEnded = this.onEnded.bind(this);
  }

  componentDidMount() {
    this.props.actions.getTrials();
  }

  handleTogglePlay() {
    this.setState({
      playing: !this.state.playing
    });
  }
  onEnded () {
    this.setState({
      playing: false
    });
  }

  renderPlayBack() {
    const {trials} = this.props;
    if (trials.selectedTrial) {
      const data = trials.selectedTrial.buffer.getChannelData(0);
      const width = Math.ceil((data.length / SAMPLE_RATE) * (BAR_WIDTH + BAR_GUTTER));
      return (
        <div>
          <div className="wave-container">
            <PlaybackWave buffer={trials.selectedTrial.buffer} src={trials.selectedTrial.blobURL} width={width} playing={this.state.playing} onEnded={this.onEnded} />
          </div>
          <button onClick={this.handleTogglePlay}>play/pause</button>
        </div>
      );
    }
  }
  render() {
    const {trials, selectedSpeech} = this.props;

    return (
      <div className="aort-Trials">
        <ul className="aort-TrialItem">
          {
            trials.list
            .filter((item) => {
              return item.refSpeech === selectedSpeech.label;
            })
            .map((item, i) => {
              const {selectTrial, setUserSpeechAudio} = this.props.actions;
              const {selectedCategory, selectedSpeech} = this.props;
              const selectItem = () => {
                const blob = dataURLtoBlob(item.dataUrl);
                blobToBuffer(blob, data => {
                  audioContext.decodeAudioData(data, function(buffer) {
                    item = {
                      ...item,
                      blobURL: window.URL.createObjectURL(blob),
                      buffer
                    };
                    selectTrial(item);
                  });
                });
              };

              const selectItemAsRef = () => {
                const blob = dataURLtoBlob(item.dataUrl);
                blobToBuffer(blob, data => {
                  audioContext.decodeAudioData(data, function(buffer) {
                    item = {
                      trialId: item.id,
                      blobURL: window.URL.createObjectURL(blob),
                      buffer
                    };
                    setUserSpeechAudio(selectedSpeech, item);
                  });
                });
              };

              const deleteItem = () => this.props.actions.deleteTrial(item);
              return (
                <li key={i}>
                  <span>{item.title}</span>
                  {
                    selectedCategory.value === 'mySpeeches' && selectedSpeech.trialId !== item.id ?
                      <button onClick={selectItemAsRef}>select as reference</button> : null
                  }
                  {
                    selectedSpeech.trialId !== item.id ?
                      <span>
                        <button onClick={selectItem}>compare trial to speech</button>
                        <button onClick={deleteItem}>delete</button>
                      </span> : null
                  }

                </li>
              );
            })
          }
        </ul>
        {this.renderPlayBack()}
      </div>
    );
  }
}

TrialsContainer.contextTypes = {
  t: PropTypes.func.isRequired
};

export default connect(
  state => ({
    selectedCategory: state.playlist.selectedCategory,
    selectedSpeech: state.playlist.selectedSpeech,
    trials: state.trials
  }),
  dispatch => ({
    actions: bindActionCreators({
      getTrials,
      deleteTrial,
      selectTrial,
      setUserSpeechAudio
    }, dispatch)
  })
)(TrialsContainer);
