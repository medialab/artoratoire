import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './TrialItem.scss';
import durationFormat from '../../utils/durationFormat';

import SilenceRatio from '../../components/SilenceRatio/SilenceRatio';


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
          <SilenceRatio buffer={item.buffer} index={index} />
        </div>
      </div>

      <div className="level-right">
        <div className="level-item buttons has-addons">
          {
            category.value === 'mySpeeches' ?
              <button className={'button ' + (speech.trialId === item.id ? 'is-selected is-primary' : '')} disabled={selectedItem && item.id === selectedItem.id} onClick={onSelectRef}>reference</button> : null
          }
          <button className={'button ' + (selectedItem && selectedItem.id === item.id ? 'is-selected is-success' : '')} disabled={speech.trialId && speech.trialId === item.id} onClick={onSelectTrial}>compare</button>
          <button className={'button'} onClick={onDeleteTrial}>delete</button>
          {/*<button className={'button'} disabled={(speech.trialId && speech.trialId === item.id) || (selectedItem && item.id === selectedItem.id)} onClick={onDeleteTrial}>delete</button>*/}
          <a href={item.blobURL} download={`${item.label}-${speech.label}.mp3`} className="button">download</a>
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
