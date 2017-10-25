import React from 'react';
import PropTypes from 'prop-types';
import './SpeechContent.scss';

const SpeechContent = ({speech}) => {
  return (
    <div className="aort-SpeechContent content">
      {speech.content ?
        <div>
          <blockquote>
            <p><em>{speech.content}</em></p>
            <p className="is-size-6 has-text-right"><a href={speech.url}>{speech.source}</a></p>
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
