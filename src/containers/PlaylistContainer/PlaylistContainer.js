import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import './PlaylistContainer.scss';
import {selectCategory, selectSpeech} from './actions';

import speechList from '../../speech_list.json';
import PlaylistSelect from '../../components/PlaylistSelect/PlaylistSelect';
import PlaylistItems from '../../components/PlaylistItems/PlaylistItems';
import SpeechContent from '../../components/SpeechContent/SpeechContent';


const PlaylistContainer = ({
  selectedCategory,
  selectedSpeech,
  actions
}, context) => {
  const translate = context.t;
  const onSelectChange = (category) => {
    if (category) actions.selectCategory(category);
  };

  const onSpeechClick = (speech) => {
    actions.selectSpeech(speech);
  };
  const options = speechList;
  return (
    <div className="aort-Playlist container">
      <div className="columns">
        <div className="column is-3">
          <PlaylistSelect
            selectedOption={selectedCategory.value}
            options={options}
            placeholder={translate('select-playlist')}
            onChange={onSelectChange} />
          {
            selectedCategory.list ?
              <PlaylistItems onClick={onSpeechClick} items={selectedCategory.list} selectedItem={selectedSpeech.label} /> : null
          }
        </div>
        <div className="column">
          {
            selectedCategory.list ?
              <SpeechContent text={selectedSpeech.content} selectedFile={selectedSpeech.file_name} /> : null
          }
        </div>
      </div>
    </div>
  );
};

PlaylistContainer.contextTypes = {
  t: PropTypes.func.isRequired
};

export default connect(
  state => ({
    selectedCategory: state.playlist.selectedCategory,
    selectedSpeech: state.playlist.selectedSpeech
  }),
  dispatch => ({
    actions: bindActionCreators({
      selectCategory,
      selectSpeech
    }, dispatch)
  })
)(PlaylistContainer);
