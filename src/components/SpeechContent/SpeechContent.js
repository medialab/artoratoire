import React from 'react';
import PropTypes from 'prop-types';
import textExtractor from '../../utils/textExtractor';
import './SpeechContent.scss';

const SpeechContent = ({text, selectedFile}) => {
  const content = text ? textExtractor(text) : null;
  return (
    <div className="aort-SpeechContent">
      {content ?
        <blockquote>
          <audio className="selectedAudio" controls src={'../../speech_material/' + selectedFile + '.mp3'}>
            Your browser does not support the audio element.
          </audio>
          <p><em>{content.content}</em></p>
          <p className="is-size-6 has-text-right"><a href={content.url}>{content.source}</a></p>
        </blockquote>
      : null}
    </div>
  );
};

SpeechContent.propTypes = {
  text: PropTypes.string
};

export default SpeechContent;
