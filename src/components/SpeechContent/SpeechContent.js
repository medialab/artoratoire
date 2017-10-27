import React from 'react';
import PropTypes from 'prop-types';
import './SpeechContent.scss';

const SpeechContent = ({speech}) => {
  return (
    <div className="aort-SpeechContent content">
      {speech.content ?
        <div className="content-container">
          <blockquote>
            <p><em>{speech.content}</em></p>
            <small className=""><a href={speech.url} target="blank">{speech.source}</a></small>
          </blockquote>
        </div>
      : null}
    </div>
  );
};

SpeechContent.propTypes = {
  text: PropTypes.string
};

export default SpeechContent;
