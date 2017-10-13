import React from 'react';
import PropTypes from 'prop-types';
import './SpeechSummary.scss';
import {silenceRmsCount} from '../../utils/audioMeasure';


const SpeechSummary = ({speech, trial}, context) => {
  const syllablesTotal = speech.syllables
                    .map((d) => d.count)
                    .reduce((a, b) => a + b, 0);


  const TrailSummary = () => {
    const trialSilence = silenceRmsCount(trial.buffer.getChannelData(0)).toFixed(2);
    return (
      <div className="column">
        <p>trial silence duration: {trialSilence}s</p>
        <p>trial duration: {trial.buffer.duration.toFixed(2)}s</p>
      </div>
    );
  };
  const BufferSummary = () => {
    const speechSilence = silenceRmsCount(speech.buffer.getChannelData(0)).toFixed(2);
    return (
      <div className="column">
        <p>speech silence duration: {speechSilence}s</p>
        <p>speech duration: {speech.buffer.duration.toFixed(2)}s</p>
      </div>
    );
  };

  return (
    <div className="columns">
      <div className="column">
        <p>word count: {speech.wordCount}</p>
        <p>syllables: {syllablesTotal}</p>
      </div>
      {
        speech.buffer ?
          <BufferSummary /> : null
      }
      {
        trial ?
          <TrailSummary /> : null
      }
    </div>
  );
};

SpeechSummary.contextTypes = {
  t: PropTypes.func.isRequired
};
SpeechSummary.propTypes = {};

export default SpeechSummary;
