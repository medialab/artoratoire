import React from 'react';
import PropTypes from 'prop-types';
import './SilenceRatio.scss';

import {SEC_BUFFER, SAMPLE_RATE} from '../../constants/AudioConstants';

const SilenceRatio = ({buffer, data, type}, context) => {
  const translate = context.t;
  const shortSilenceDuration = data.filter(d => d.label === 'short').length * (SAMPLE_RATE / SEC_BUFFER);
  const longSilenceDuration = data.filter(d => d.label === 'long').length * (SAMPLE_RATE / SEC_BUFFER);

  const speakingDuration = buffer.duration - shortSilenceDuration - longSilenceDuration;

  return (
    <div className="silence-ratio">
      { type === 'speech' ?
        <small>
          <span className="speaking">{translate('speaking')}</span>
          <span> | </span>
          <span className="silence short">{translate('short-silence')}</span>
          <span> | </span>
          <span className="silence long">{translate('long-silence')}</span>
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
        <span className="speaking">{Math.ceil(speakingDuration / buffer.duration * 100) + '%'} </span>
        <span> | </span>
        <span className="silence short">{Math.floor(shortSilenceDuration / buffer.duration * 100) + '%'}</span>
        <span> | </span>
        <span className="silence long">{Math.floor(longSilenceDuration / buffer.duration * 100) + '%'}</span>
      </small>}
    </div>
  );
};

SilenceRatio.contextTypes = {
  t: PropTypes.func.isRequired
};
SilenceRatio.propTypes = {};

export default SilenceRatio;
