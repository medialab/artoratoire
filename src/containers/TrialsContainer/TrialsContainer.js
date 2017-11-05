import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import './TrialsContainer.scss';
import {getTrials, deleteTrial, selectTrial} from './actions';
import {setUserSpeechAudio} from '../PlaylistContainer/actions';
import {dataURLtoBlob, blobToBuffer} from '../../utils/blobConverter';
import TrialItem from '../../components/TrialItem/TrialItem';
import PlaybackBox from '../../components/PlaybackBox/PlaybackBox';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

class TrialsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      isEnded: false,
      trialItems: []
    };
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.handleEnded = this.handleEnded.bind(this);
    this.activateTab = this.activateTab.bind(this);

  }

  componentDidMount() {
    this.props.actions.getTrials();
  }

  componentWillReceiveProps(nextProps) {
    const {trials} = nextProps;
    if (trials.list.length !== this.props.trials.list.length) {
      if (trials.list.length > 0) {
        const items = [];

        trials.list.map((item) => {
          const blob = dataURLtoBlob(item.dataUrl);
          blobToBuffer(blob, data => {
            audioContext.decodeAudioData(data, (buffer) => {
              item = {
                ...item,
                blobURL: window.URL.createObjectURL(blob),
                buffer
              };
              items.push(item);

              this.setState({
                trialItems: items
              });
            });
          });
        });
      }
      else {
        this.setState({
          trialItems: []
        });
      }
    }
  }

  handleTogglePlay() {
    this.setState({
      isPlaying: !this.state.isPlaying,
      isEnded: false
    });
  }
  handleEnded () {
    this.setState({
      isPlaying: false,
      isEnded: true
    });
  }

  activateTab () {
    this.props.onTabSelect(0);
  }

  renderPlayBack() {
    const {trials} = this.props;
    if (trials.selectedTrial) {
      return (
        <PlaybackBox speech={trials.selectedTrial} source={trials.selectedTrial.blobURL} isPlaying={this.state.isPlaying} isEnded={this.state.isEnded} onEnded={this.handleEnded} onTogglePlay={this.handleTogglePlay} />
      );
    }
  }
  render() {
    const {trials, selectedSpeech, selectedCategory} = this.props;
    const {trialItems} = this.state;

    return (
      <div className="aort-Trials">
        {this.renderPlayBack()}
        {
          trialItems
          .filter((item) => {
            return item.refSpeech === selectedSpeech.label;
          }).length === 0 ?
            <div className="container">
              <div className="columns is-centered">
                <div className="column is-one-quarter has-text-centered notification">
                  You don't have any trials, please make a <a onClick={this.activateTab} className="has-text-primary">Recording</a> first.
                </div>
              </div>
            </div> : null
        }
        <ul>
          {
            trialItems
            .filter((item) => {
              return item.refSpeech === selectedSpeech.label;
            })
            .sort((a, b) => {
              return b.startTime - a.startTime;
            })
            .map((item, i) => {
              const handleSelectTrial = () => this.props.actions.selectTrial(item);
              const handleSelectRef = () => {
                item = {
                  trialId: item.id,
                  buffer: item.buffer,
                  blobURL: item.blobURL
                };
                this.props.actions.setUserSpeechAudio(selectedSpeech, item);
              };

              const handleDeleteTrial = () => this.props.actions.deleteTrial(item);
              return (
                <li key={i} className="container">
                  <TrialItem item={item} index={i} speech={selectedSpeech} selectedItem={trials.selectedTrial} category={selectedCategory} onSelectTrial={handleSelectTrial} onSelectRef={handleSelectRef} onDeleteTrial={handleDeleteTrial} />
                </li>
              );
            })
          }
        </ul>
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
