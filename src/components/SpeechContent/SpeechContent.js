import React from 'react';
import PropTypes from 'prop-types';
import './SpeechContent.scss';

const SpeechContent = ({speech}) => {
  return (
    <div className="aort-SpeechContent">
      {speech.content ?
        <div>
          <blockquote>
            <audio className="selectedAudio" controls src={'../../speech_material/' + speech.file_name + '.mp3'}>
              Your browser does not support the audio element.
            </audio>
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
