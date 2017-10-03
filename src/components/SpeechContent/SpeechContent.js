import React from 'react';
import PropTypes from 'prop-types';
import './SpeechContent.scss';

const SpeechContent = ({speech}) => {
  let syllablesTotal;
  if (speech.content) {
    syllablesTotal = speech.syllables
                      .map((d) => d.count)
                      .reduce((a, b) => a + b, 0);
  }
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
          <p>word count: {speech.wordCount}</p>
          <p>syllables: {syllablesTotal}</p>
        </div>
      : null}
    </div>
  );
};

SpeechContent.propTypes = {
  text: PropTypes.string
};

export default SpeechContent;
