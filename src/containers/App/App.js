import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setLanguage} from 'redux-i18n';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import './App.scss';
import Header from '../../components/Header/Header';
import PlaylistContainer from '../PlaylistContainer/PlaylistContainer';
import RecorderContainer from '../RecorderContainer/RecorderContainer';
import TrialsContainer from '../TrialsContainer/TrialsContainer';


const App = ({
  lang,
  selectedSpeech,
  actions
}) => {
  return (
    <div className="aort-App">
      <Header lang={lang} setLanguage={actions.setLanguage} />
      <div>
        <section className="content" >
          <PlaylistContainer />
        </section>
        {
          selectedSpeech.label ?
            <section className="container">
              <Tabs forceRenderTabPanel={true} selectedTabPanelClassName="tab-shown">
                <div className="tabs is-fullwidth">
                  <TabList>
                    <Tab selectedClassName="is-active">
                      <a>Recording</a>
                    </Tab>
                    <Tab selectedClassName="is-active">
                      <a>Trials</a>
                    </Tab>
                  </TabList>
                </div>
                <TabPanel className="tab-hidden">
                  <RecorderContainer />
                </TabPanel>
                <TabPanel className="tab-hidden">
                  <TrialsContainer />
                </TabPanel>
              </Tabs>
            </section> : null
        }
      </div>
    </div>
  );
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
