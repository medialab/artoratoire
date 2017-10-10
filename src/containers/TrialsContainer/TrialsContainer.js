import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

// import './TrialsContainer.scss';
import {getTrials, deleteTrial, selectTrial} from './actions';
import {dataURLtoBlob, blobToBuffer} from '../../utils/blobConverter';
import PlaybackWave from '../../components/PlaybackWave/PlaybackWave';

class TrialsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blobURL: null,
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

  render() {
    const {trials, selectedSpeech} = this.props;
    return (
      <div>
        {
          /*trials.selectedTrial ?
            <div>
              <PlaybackWave buffer={trials.selectedTrial.buffer} src={this.state.blobURL ? this.state.blobURL : trials.selectedTrial.blobURL} playing={this.state.playing} onEnded={this.onEnded} />
              <button onClick={this.handleTogglePlay}>play/pause</button>
            </div> : null*/
        }
        <ul className="aort-TrialItem">
          {
            trials.list
            .filter((item) => {
              return item.refSpeech === selectedSpeech.file_name;
            })
            .map((item, i) => {
              const {selectTrial} = this.props.actions;
              const selectItem = () => {
                const blob = dataURLtoBlob(item.dataUrl);
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                blobToBuffer(blob, data => {
                  audioContext.decodeAudioData(data, function(buffer) {
                    item = {
                      ...item,
                      blob,
                      buffer
                    };
                    selectTrial(item);
                  });
                });

                this.setState({
                  blobURL: window.URL.createObjectURL(blob)
                });
              };

              const deleteItem = () => this.props.actions.deleteTrial(item);
              // const selectItem = () => this.props.actions.selectTrial(item);
              return (
                <li key={i}>
                  <span>{item.title}</span>
                  <button onClick={selectItem}>select</button>
                  <button onClick={deleteItem}>delete</button>
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
    selectedSpeech: state.playlist.selectedSpeech,
    trials: state.trials
  }),
  dispatch => ({
    actions: bindActionCreators({
      getTrials,
      deleteTrial,
      selectTrial
    }, dispatch)
  })
)(TrialsContainer);
