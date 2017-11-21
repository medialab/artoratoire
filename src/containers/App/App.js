import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setLanguage} from 'redux-i18n';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import './App.scss';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';

import PlaylistContainer from '../PlaylistContainer/PlaylistContainer';
import RecorderContainer from '../RecorderContainer/RecorderContainer';
import TrialsContainer from '../TrialsContainer/TrialsContainer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    };
    this.handleTabSelect = this.handleTabSelect.bind(this);
  }


  handleTabSelect(index) {
    this.setState({
      tabIndex: index
    });
  }

  render() {
    const {lang, selectedSpeech, actions} = this.props;
    const translate = this.context.t;
    return (
      <div className="aort-App">
        <NavBar lang={lang} setLanguage={actions.setLanguage} />
        <section id="intro" className="hero is-fullheight">
          <div className="hero-body">
            <Header lang={lang} setLanguage={actions.setLanguage} />
          </div>
        </section>
        <section id="main" className="section element">
          <PlaylistContainer onTabSelect={this.handleTabSelect} />
          {
            selectedSpeech.label ?
              <div className="container tabs-container">
                <Tabs selectedIndex={this.state.tabIndex} onSelect={this.handleTabSelect} forceRenderTabPanel={true} selectedTabPanelClassName="tab-shown">
                  <div className="tabs is-fullwidth">
                    <TabList>
                      <Tab selectedClassName="is-active">
                        <a>{translate('recording')}</a>
                      </Tab>
                      <Tab selectedClassName="is-active">
                        <a>{translate('trials')}</a>
                      </Tab>
                    </TabList>
                  </div>
                  <TabPanel className="tab-hidden">
                    <RecorderContainer />
                  </TabPanel>
                  <TabPanel className="tab-hidden">
                    <TrialsContainer onTabSelect={this.handleTabSelect} />
                  </TabPanel>
                </Tabs>
              </div> : null
          }
        </section>
        <Footer />
      </div>
    );
  }
}

App.contextTypes = {
  t: PropTypes.func.isRequired
};

export default connect(
  state => ({
    lang: state.i18nState.lang,
    selectedSpeech: state.playlist.selectedSpeech
  }),
  dispatch => ({
    actions: bindActionCreators({
      setLanguage
    }, dispatch)
  })
)(App);
