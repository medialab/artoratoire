import React from 'react';
import PropTypes from 'prop-types';
import Scrollchor from 'react-scrollchor';

import './Header.scss';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';

const Header = ({lang, setLanguage}, context) => {
  const translate = context.t;
  return (
    <div className="aort-Header container">
      <div className="columns is-centered content">
        <div className="column is-half">
          <div className="has-text-centered">
            <p className="title is-2">Art oratoire</p>
            <p className="subtitle is-4">{translate('subtitle')}</p>
            <LanguageSwitch className={'is-white'} lang={lang} setLanguage={setLanguage} />
          </div>
          <div>
            <p>{translate('intro-first')}</p>
            <p>{translate('intro-second')}</p>
            <ul>
              <li>{translate('intro-step-one')}</li>
              <li>{translate('intro-step-two')}</li>
              <li>{translate('intro-step-three')}</li>
            </ul>
          </div>
          <div className="link-down has-text-centered">
            <Scrollchor to="#main" className="button is-white has-text-primary">
              <span>Start Playing</span>
              <br />
              <span className="icon">
                <i className="fa fa-long-arrow-down"></i>
              </span>
            </Scrollchor>
          </div>
        </div>
      </div>
    </div>
  );
};


Header.contextTypes = {
  t: PropTypes.func.isRequired
};

Header.propTypes = {};

export default Header;
