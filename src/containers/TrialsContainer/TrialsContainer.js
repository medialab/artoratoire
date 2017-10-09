import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

// import './TrialsContainer.scss';
import {getTrials, deleteTrial, selectTrial} from './actions';
import {dataURLtoBlob, blobToBuffer} from '../../utils/blobConverter';


class TrialsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blobURL: null
    };
  }

  componentDidMount() {
    this.props.actions.getTrials();
  }

  render() {
    return (
      <div>
        <audio controls="controls" src={this.state.blobURL}></audio>
        <ul className="aort-TrialItem">
          {
            this.props.trials.list
            .filter((item) => {
              return item.refSpeech === this.props.selectedSpeech.file_name;
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
