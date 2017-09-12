import React from 'react';
import PropTypes from 'prop-types';
import './SpeechContent.scss';

const SpeechContent = ({text}) => {
  return (
    <p>{text}</p>
  );
};

SpeechContent.propTypes = {
  text: PropTypes.string
};

export default SpeechContent;
