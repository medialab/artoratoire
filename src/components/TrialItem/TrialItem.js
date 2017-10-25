import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './TrialItem.scss';
import {silenceRmsCount} from '../../utils/audioMeasure';
import durationFormat from '../../utils/durationFormat';

const TrialItem = ({
  item,
  speech,
  index,
  selectedItem,
  category,
  onSelectTrial,
  onSelectRef,
  onDeleteTrial
}, context) => {

  const startTime = moment(item.startTime).format('MMMM DD YYYY, h:mm a');
  const duration = durationFormat(item.buffer.duration * 1000);
  const silence = silenceRmsCount(item.buffer.getChannelData(0));
  const speaking = item.buffer.duration - silence;

  return (
    <div className="aort-TrialItem level">
      <div className="level-left">
        <div className="level-item">
          <div>
            <p>{item.label}</p>
            <p>{duration}</p>
            <small>{startTime}</small>
          </div>
        </div>
      </div>
      <div className="level-item">
        <div>
          { index === 0 ?
            <p>
              <span className="has-text-danger">Speaking</span>
              <span>/</span>
              <span className="has-text-primary">Silence</span>
            </p> : null
          }
          <p className="bars">
            <span className="speaking" style={{width : speaking / item.buffer.duration * 100 + '%'}}></span>
            <span className="silence" style={{width : silence / item.buffer.duration * 100 + '%'}}></span>
          </p>
          <p>
            <span className="has-text-danger">{Math.floor(speaking / item.buffer.duration * 100) + '%'} </span>
            <span>/</span>
            <span className="has-text-primary">{Math.ceil(silence / item.buffer.duration * 100) + '%'}</span>
          </p>
        </div>
      </div>

      <div className="level-right">
        <div className="level-item buttons has-addons">
          {
            category.value === 'mySpeeches' ?
              <button className={'button ' + (speech.trialId === item.id ? 'is-selected is-primary' : '')} disabled={selectedItem && item.id === selectedItem.id} onClick={onSelectRef}>reference</button> : null
          }
          <button className={'button ' + (selectedItem && selectedItem.id === item.id ? 'is-selected is-success' : '')} disabled={speech.trialId && speech.trialId === item.id} onClick={onSelectTrial}>compare</button>
          <button className={'button'} disabled={(speech.trialId && speech.trialId === item.id) || (selectedItem && item.id === selectedItem.id)} onClick={onDeleteTrial}>delete</button>
        </div>
      </div>
    </div>
  );
};

TrialItem.contextTypes = {
  t: PropTypes.func.isRequired
};
TrialItem.propTypes = {};

export default TrialItem;
