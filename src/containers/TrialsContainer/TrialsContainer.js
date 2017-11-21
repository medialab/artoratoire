import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import './TrialsContainer.scss';
import {getTrials, deleteTrial, selectTrial} from './actions';
import {setUserSpeechAudio, toggleSpeechWave} from '../PlaylistContainer/actions';
import {dataURLtoBlob, blobToBuffer} from '../../utils/blobConverter';
import {getSpeechData} from '../../utils/audioMeasure';
import PlaybackItems from '../../components/PlaybackItems/PlaybackItems';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

class TrialsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trialItems: []
    };
    this.handleSelectTrial = this.handleSelectTrial.bind(this);
    this.handleSelectRef = this.handleSelectRef.bind(this);
    this.handleDeleteTrial = this.handleDeleteTrial.bind(this);
    this.activateTab = this.activateTab.bind(this);
    this.handleToggleSpeechWave = this.handleToggleSpeechWave.bind(this);
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
                buffer,
                speechData: getSpeechData(buffer.getChannelData(0))
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

  activateTab () {
    this.props.onTabSelect(0);
  }

  handleSelectTrial(item) {
    this.props.actions.selectTrial(item);
  }

  handleSelectRef(item) {
    const ref = {
      trialId: item.id,
      buffer: item.buffer,
      speechData: item.speechData,
      blobURL: item.blobURL
    };
    this.props.actions.setUserSpeechAudio(this.props.selectedSpeech, ref);
  }

  handleDeleteTrial(item) {
    this.props.actions.deleteTrial(item);
    if (this.props.trials.selectedTrial.id === item.id) {
      this.props.actions.selectTrial(null);
    }
  }
  handleToggleSpeechWave(showWave) {
    this.props.actions.toggleSpeechWave(showWave);
  }

  render() {
    const {trials, selectedSpeech, selectedCategory} = this.props;
    const {trialItems} = this.state;
    const translate = this.context.t;

    const filteredTrialItems = trialItems.filter((item) => {
              return item.refSpeech === selectedSpeech.label;
            });
    return (
      <div className="aort-Trials">
        {
          filteredTrialItems.length === 0 ?
            <div className="container">
              <div className="columns is-centered">
                <div className="column is-one-quarter has-text-centered notification">
                  {translate('trials-message-one')}&nbsp;
                  <a onClick={this.activateTab} className="has-text-primary">{translate('recording')}
                  </a>&nbsp;{translate('trials-message-two')}
                </div>
              </div>
            </div> : null
        }
        <PlaybackItems items={filteredTrialItems} onSelectRef={this.handleSelectRef} onDeleteTrial={this.handleDeleteTrial} onSelectTrial={this.handleSelectTrial} selectedSpeech={selectedSpeech} category={selectedCategory} selectedItem={trials.selectedTrial} type={'trials'} onToggleSpeechWave={this.handleToggleSpeechWave} />
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
      setUserSpeechAudio,
      toggleSpeechWave
    }, dispatch)
  })
)(TrialsContainer);
