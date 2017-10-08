import React from 'react';
import PropTypes from 'prop-types';
import './SpeechSummary.scss';
import silenceMeature from '../../utils/silenceMeasure';


const SpeechSummary = ({speech, trial}, context) => {
  const syllablesTotal = speech.syllables
                    .map((d) => d.count)
                    .reduce((a, b) => a + b, 0);

  const speechSilence = silenceMeature(speech.buffer.getChannelData(0)).toFixed(2);

  const TrailSummary = () => {
    if (trial) {
      const trialSilence = silenceMeature(trial.buffer.getChannelData(0)).toFixed(2);
      return (
        <div>
          <p>trial silence duration: {trialSilence}s</p>
          <p>trial duration: {trial.buffer.duration.toFixed(2)}s</p>
        </div>
      );
    }
    else return null;
  };

  return (
    <div>
      <p>word count: {speech.wordCount}</p>
      <p>syllables: {syllablesTotal}</p>
      <p>speech silence duration: {speechSilence}s</p>
      <p>speech duration: {speech.buffer.duration.toFixed(2)}s</p>
      <TrailSummary />
    </div>
  );
};

SpeechSummary.contextTypes = {
  t: PropTypes.func.isRequired
};
SpeechSummary.propTypes = {};

export default SpeechSummary;
