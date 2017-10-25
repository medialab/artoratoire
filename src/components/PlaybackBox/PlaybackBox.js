import React from 'react';
import PropTypes from 'prop-types';
import './PlaybackBox.scss';

import PlaybackWave from '../PlaybackWave/PlaybackWave';
import durationFormat from '../../utils/durationFormat';

const PlaybackBox = ({source, speech, playing, onEnded, onTogglePlay}, context) => {
  const duration = speech.buffer.duration * 1000;
  const formatedDuration = durationFormat(duration);
  return (
    <div className="aort-PlaybackBox container">
      <div className="wave-container">
        <PlaybackWave src={source} buffer={speech.buffer} playing={playing} onEnded={onEnded} />
      </div>
      <div className="level player-control">
        <div className="level-left">
          <div className="level-item">
            <button className="button circle-button is-medium" onClick={onTogglePlay}>
              <span className="icon">
                {
                  playing ?
                    <i className="fa fa-pause"></i> : <i className="fa fa-play offset-icon"></i>
                }
              </span>
            </button>
          </div>
          <div className="level-item">
            <div>
              <p>{speech.label}</p>
              <small>{formatedDuration}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PlaybackBox.contextTypes = {
  t: PropTypes.func.isRequired
};
PlaybackBox.propTypes = {};

export default PlaybackBox;
