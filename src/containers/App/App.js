import React from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setLanguage} from 'redux-i18n';

import 'normalize.css';

import LanguageSwitch from '../../components/LanguageSwitch/LanguageSwitch';
import PlaylistContainer from '../PlaylistContainer/PlaylistContainer';

const App = ({
  lang,
  actions
}) => (
  <div>
    <PlaylistContainer />
    <LanguageSwitch lang={lang} setLanguage={actions.setLanguage} />
  </div>
);

export default connect(
  state => ({
    lang: state.i18nState.lang,
  }),
  dispatch => ({
    actions: bindActionCreators({
      setLanguage
    }, dispatch)
  })
)(App);

