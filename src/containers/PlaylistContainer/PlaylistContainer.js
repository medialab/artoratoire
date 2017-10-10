import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import './PlaylistContainer.scss';
import {selectCategory, selectSpeech} from './actions';

import speechList from '../../speech_list.json';
import PlaylistSelect from '../../components/PlaylistSelect/PlaylistSelect';
import PlaylistItems from '../../components/PlaylistItems/PlaylistItems';
import SpeechContent from '../../components/SpeechContent/SpeechContent';
import SpeechSummary from '../../components/SpeechSummary/SpeechSummary';
import PlaybackWave from '../../components/PlaybackWave/PlaybackWave';

class PlaylistContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onSpeechClick = this.onSpeechClick.bind(this);
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.onEnded = this.onEnded.bind(this);
  }

  onSelectChange (category) {
    if (category)
      this.props.actions.selectCategory(category);
  }

  onSpeechClick (speech) {
    this.props.actions.selectSpeech(speech);
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
  render() {
    const options = speechList;
    const {selectedSpeech, selectedCategory, selectedTrial} = this.props;
    const translate = this.context.t;

    return (
      <div className="aort-Playlist container">
        <div className="columns">
          <div className="column is-3">
            <PlaylistSelect
              selectedOption={selectedCategory.value}
              options={options}
              placeholder={translate('select-playlist')}
              onChange={this.onSelectChange} />
            {
              selectedCategory.list ?
                <PlaylistItems onClick={this.onSpeechClick} items={selectedCategory.list} selectedItem={selectedSpeech.label} /> : null
            }
          </div>
          <div className="column">
            {
              selectedSpeech.content ?
                <SpeechContent speech={selectedSpeech} /> : null
            }
          </div>
        </div>
        {
          /*selectedSpeech.content ?
            <div>
              <PlaybackWave src={`../../speech_material/${selectedSpeech.file_name}.mp3`} buffer={selectedSpeech.buffer} playing={this.state.playing} onEnded={this.onEnded} />
              <button onClick={this.handleTogglePlay}>play/pause</button>
            </div> : null*/
        }
        <div>
          {
            selectedSpeech.content ?
              <SpeechSummary speech={selectedSpeech} trial={selectedTrial} /> : null
          }
        </div>
      </div>
    );
  }
}


PlaylistContainer.contextTypes = {
  t: PropTypes.func.isRequired
};

export default connect(
  state => ({
    selectedCategory: state.playlist.selectedCategory,
    selectedSpeech: state.playlist.selectedSpeech,
    selectedTrial: state.trials.selectedTrial
  }),
  dispatch => ({
    actions: bindActionCreators({
      selectCategory,
      selectSpeech
    }, dispatch)
  })
)(PlaylistContainer);
