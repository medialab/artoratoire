import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setLanguage} from 'redux-i18n';

import './App.scss';
import Header from '../../components/Header/Header';
import PlaylistContainer from '../PlaylistContainer/PlaylistContainer';
import RecorderContainer from '../RecorderContainer/RecorderContainer';
import TrialsContainer from '../TrialsContainer/TrialsContainer';

const App = ({
  lang,
  actions
}) => {
  return (
    <div className="aort-App">
      <Header lang={lang} setLanguage={actions.setLanguage} />
      <div className="content">
        <section>
          <PlaylistContainer />
        </section>
        <section>
          <div className="container">
            <RecorderContainer />
          </div>
        </section>
        <section>
          <div className="container">
            <TrialsContainer />
          </div>
        </section>
      </div>
    </div>
  );
};


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
