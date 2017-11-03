import React from 'react';
import PropTypes from 'prop-types';

import './LanguageSwitch.scss';

const LanguageSwitch = ({className, lang, setLanguage}) => {
  const onClick = e => {
    e.stopPropagation();
    if (lang === 'en') {
      setLanguage('fr');
    }
    else {
      setLanguage('en');
    }
  };
  return (
    <div className="aort-LanguageSwitch">
      <button className={`button ${className}`} onClick={onClick}>
        <span className={lang === 'en' ? 'active' : ''}>en</span>/<span className={lang === 'fr' ? 'active' : ''}>fr</span>
      </button>
    </div>
  );
};

LanguageSwitch.propTypes = {
  setLanguage: PropTypes.func
};
export default LanguageSwitch;
