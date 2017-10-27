import React from 'react';
import PropTypes from 'prop-types';
import './SilenceRatio.scss';

import {normalizedBuffer} from '../../utils/audioMeasure';
import {groupBy, keys} from 'lodash';

const SilenceRatio = ({buffer, index}, context) => {
  const silence = normalizedBuffer(buffer.getChannelData(0))
                  .filter(d => d.status === 'silence')
                  .map(d => d.duration);
  const silenceDuration = silence.reduce((a, b) => a + b, 0);

  // const dist = groupBy(silence, Math.floor);
  //   return (
  //     <div className="dist">
  //       {
  //         keys(dist).map((key, i) => {
  //           return (
  //             <div key={i}>
  //               <p>{`${key}s - ${parseInt(key)+1}s`}</p>
  //               <span className="silence" style={{width: dist[key].length * 10}}></span>
  //               <small>{dist[key].length}</small>
  //             </div>
  //           );
  //         })
  //       }
  //     </div>
  //   );

  const speakingDuration = buffer.duration - silenceDuration;
  return (
    <div className="silence-ratio">
      { index === 0 ?
        <p>
          <span className="has-text-danger">Speaking</span>
          <span>/</span>
          <span className="has-text-primary">Silence</span>
        </p> : null
      }
      <div className="bars">
        <span className="speaking" style={{width : speakingDuration / buffer.duration * 100 + '%'}}></span>
        <span className="silence" style={{width : silenceDuration / buffer.duration * 100 + '%'}}></span>
      </div>
      <small className="level bars">
        <div className="level-left">
          <span className="has-text-danger">{Math.floor(speakingDuration / buffer.duration * 100) + '%'} </span>
          <span>/</span>
          <span className="has-text-primary">{Math.ceil(silenceDuration / buffer.duration * 100) + '%'}</span>
        </div>
        <div className="level-right">
          <span className="has-text-right"></span>
        </div>
      </small>
    </div>
  );
};

SilenceRatio.contextTypes = {
  t: PropTypes.func.isRequired
};
SilenceRatio.propTypes = {};

export default SilenceRatio;
