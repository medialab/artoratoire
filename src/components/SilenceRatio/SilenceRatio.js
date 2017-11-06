import React from 'react';
import PropTypes from 'prop-types';
import './SilenceRatio.scss';

import {normalizedBuffer} from '../../utils/audioMeasure';

const SilenceRatio = ({buffer, index}, context) => {
  const silence = normalizedBuffer(buffer.getChannelData(0))
                  .filter(d => d.status === 'silence')
                  .map(d => d.duration);
  const silenceDuration = silence.reduce((a, b) => a + b, 0);

  let shortSilenceDuration = 0;
  let longSilenceDuration = 0;
  silence.forEach((d) => {
    if (d < 1)
      shortSilenceDuration += d;
    else
      longSilenceDuration += d;
  });

  const speakingDuration = buffer.duration - silenceDuration;

  return (
    <div className="silence-ratio">
      { index === 0 ?
        <small>
          <span className="has-text-danger">Speaking</span>
          <span> | </span>
          <span className="silence">Short</span>
          <span> | </span>
          <span className="silence">Long Silence</span>
        </small> : null
      }
      <div className="bars">
        <div className="speaking" style={{width : speakingDuration / buffer.duration * 100 + '%'}}>
          <span></span>
        </div>
        {
          shortSilenceDuration > 0 ?
          <div className="silence short" style={{width : shortSilenceDuration / buffer.duration * 100 + '%'}}>
            <span></span>
          </div> : null
        }
        {
          longSilenceDuration > 0 ?
          <div className="silence long" style={{width : longSilenceDuration / buffer.duration * 100 + '%'}}>
            <span></span>
          </div> : null
        }
      </div>
      {<small>
        <span className="has-text-danger">{Math.ceil(speakingDuration / buffer.duration * 100) + '%'} </span>
        <span> | </span>
        <span className="silence">{Math.floor(shortSilenceDuration / buffer.duration * 100) + '%'}</span>
        <span> | </span>
        <span className="silence">{Math.floor(longSilenceDuration / buffer.duration * 100) + '%'}</span>
      </small>}
    </div>
  );
};

SilenceRatio.contextTypes = {
  t: PropTypes.func.isRequired
};
SilenceRatio.propTypes = {};

export default SilenceRatio;
