import React from 'react';
import PropTypes from 'prop-types';
import './SpeechSummary.scss';
import silenceMeature from '../../utils/silenceMeasure';


const SpeechSummary = ({speech}, context) => {
  const syllablesTotal = speech.syllables
                    .map((d) => d.count)
                    .reduce((a, b) => a + b, 0);
  const silence = silenceMeature(speech.buffer.getChannelData(0)).toFixed(2);

  return (
    <div>
      <p>word count: {speech.wordCount}</p>
      <p>syllables: {syllablesTotal}</p>
      <p>silence duration: {silence}s</p>
      <p>speech duration: {speech.buffer.duration.toFixed(2)}s</p>
    </div>
  );
};

SpeechSummary.contextTypes = {
  t: PropTypes.func.isRequired
};
SpeechSummary.propTypes = {};

export default SpeechSummary;
