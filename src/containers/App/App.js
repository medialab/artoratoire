import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setLanguage} from 'redux-i18n';

import './App.scss';
import Header from '../../components/Header/Header';
import PlaylistContainer from '../PlaylistContainer/PlaylistContainer';

const App = ({
  lang,
  actions
}) => (
  <div className="aort-App">
    <Header lang={lang} setLanguage={actions.setLanguage} />
    <div className="content is-medium">
      <section>
        <PlaylistContainer />
      </section>
      <section>
        <div className="container">
          <hr />
        </div>
      </section>
    </div>
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
