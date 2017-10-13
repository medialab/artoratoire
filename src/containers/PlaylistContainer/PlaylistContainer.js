import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import './PlaylistContainer.scss';
import {selectCategory, selectSpeech, selectUserSpeech, saveUserSpeeches, getUserSpeeches} from './actions';
import {selectTrial} from '../TrialsContainer/actions';


import speechList from '../../speech_list.json';
import PlaylistSelect from '../../components/PlaylistSelect/PlaylistSelect';
import PlaylistItems from '../../components/PlaylistItems/PlaylistItems';
import SpeechContent from '../../components/SpeechContent/SpeechContent';
import SpeechSummary from '../../components/SpeechSummary/SpeechSummary';
import PlaybackWave from '../../components/PlaybackWave/PlaybackWave';
import NewSpeechForm from '../../components/NewSpeechForm/NewSpeechForm';

class PlaylistContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      addNew: false
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onSpeechClick = this.onSpeechClick.bind(this);
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.onEnded = this.onEnded.bind(this);
    this.showNewSpeechForm = this.showNewSpeechForm.bind(this);
    this.onNewSpeechSaved = this.onNewSpeechSaved.bind(this);
    this.onNewSpeechCancelled = this.onNewSpeechCancelled.bind(this);
  }

  componentDidMount () {
    this.props.actions.getUserSpeeches();
  }

  onSelectChange (category) {
    if (category && category.value !== this.props.selectedCategory.value) {
      this.props.actions.selectCategory(category);
      this.props.actions.selectTrial(null);
    }
    this.setState({
      addNew: false
    });
  }

  onSpeechClick (speech) {
    if (this.props.selectedSpeech.label !== speech.label) {
      if (this.props.selectedCategory.value === 'mySpeeches')
        this.props.actions.selectUserSpeech(speech);
      else
        this.props.actions.selectSpeech(speech);

      this.props.actions.selectTrial(null);
    }
    this.setState({
      addNew: false
    });
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

  showNewSpeechForm () {
    this.setState({
      addNew: true
    });
  }

  hideNewSpeechForm () {
    this.setState({
      addNew: false
    });
  }
  onNewSpeechCancelled () {
    this.hideNewSpeechForm();
  }

  onNewSpeechSaved (speech) {
    this.props.actions.saveUserSpeeches(speech, this.props.userSpeeches);
    this.hideNewSpeechForm();
  }

  renderPlayBack() {
    const {selectedSpeech} = this.props;
    let source;
    if (selectedSpeech.file_name) {
      source = `../../speech_material/${selectedSpeech.file_name}.mp3`;
    }
    else {
      source = selectedSpeech.blobURL;
    }
    if (selectedSpeech.buffer) {
      return (
        <div>
          <PlaybackWave src={source} buffer={selectedSpeech.buffer} playing={this.state.playing} onEnded={this.onEnded} />
          <button onClick={this.handleTogglePlay}>play/pause</button>
        </div>
      );
    }
  }

  render() {
    const {selectedSpeech, selectedCategory, selectedTrial, userSpeeches} = this.props;
    const translate = this.context.t;
    let options;
    if (userSpeeches.list.length > 0) {
      options = speechList.concat(userSpeeches);
    }
    else options = speechList;
    return (
      <div className="aort-Playlist container">
        <div className="columns">
          <div className="column is-3">
            {
              !this.state.addNew ?
                <div>
                  <PlaylistSelect
                    selectedOption={selectedCategory.value}
                    options={options}
                    placeholder={translate('select-playlist')}
                    onChange={this.onSelectChange} />
                  {
                    selectedCategory.list ?
                      <PlaylistItems onClick={this.onSpeechClick} items={selectedCategory.list} selectedItem={selectedSpeech.label} /> : null
                  }
                  {
                    selectedCategory.list ? null : <span>or </span>
                  }
                  <div>
                    <button className="button" onClick={this.showNewSpeechForm}>Add a speech</button>
                  </div>
                </div> : null
            }
          </div>
          <div className="column">
            {
              selectedSpeech.content && !this.state.addNew ?
                <SpeechContent speech={selectedSpeech} /> : null
            }
            {
              this.state.addNew ?
                <NewSpeechForm speech={this.state.newSpeech} onSave={this.onNewSpeechSaved} onCancel={this.onNewSpeechCancelled} /> : null
            }
          </div>
        </div>
        <div>
          {
            selectedSpeech.content && !this.state.addNew ?
              <SpeechSummary speech={selectedSpeech} trial={selectedTrial} /> : null
          }
        </div>
        {this.renderPlayBack()}
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
    selectedTrial: state.trials.selectedTrial,
    userSpeeches: state.playlist.userSpeeches
  }),
  dispatch => ({
    actions: bindActionCreators({
      selectCategory,
      selectSpeech,
      selectUserSpeech,
      saveUserSpeeches,
      getUserSpeeches,
      selectTrial
    }, dispatch)
  })
)(PlaylistContainer);
