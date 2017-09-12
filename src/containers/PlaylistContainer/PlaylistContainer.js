import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {selectCategory, selectSpeech, getSpeechText} from './actions';

import speechList from '../../speech_list.json';
import PlaylistSelect from '../../components/PlaylistSelect/PlaylistSelect';
import PlaylistItems from '../../components/PlaylistItems/PlaylistItems';
import SpeechContent from '../../components/SpeechContent/SpeechContent';


const PlaylistContainer = ({
  selectedCategory,
  selectedSpeech,
  speechText,
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
    <div>
      <PlaylistSelect
        selectedOption={selectedCategory.value}
        options={options}
        placeholder={translate('select-playlist')}
        onChange={onSelectChange} />
      {
        selectedCategory.list ?
          <PlaylistItems onClick={onSpeechClick} items={selectedCategory.list} selectedItem={selectedSpeech} />
          : null
      }
      <SpeechContent text={speechText} />
    </div>
  );
};

PlaylistContainer.contextTypes = {
  t: PropTypes.func.isRequired
};

export default connect(
  state => ({
    selectedCategory: state.playlist.selectedCategory,
    selectedSpeech: state.playlist.selectedSpeech,
    speechText: state.playlist.speechText
  }),
  dispatch => ({
    actions: bindActionCreators({
      selectCategory,
      selectSpeech,
      getSpeechText
    }, dispatch)
  })
)(PlaylistContainer);
