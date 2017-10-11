import {blobToDataURL} from '../../utils/blobConverter';
import uuid from 'uuid';

// Actions

export const SAVE_TRIAL = 'SAVE_TRIAL';
export const DELETE_TRIAL = 'DELETE_TRIAL';
export const CLEAR_TRIALS = 'CLEAR_TRIALS';
export const GET_TRIALS = 'GET_TRIALS';
export const INIT_TRIALS = 'INIT_TRIALS';
export const EXCEED_MAX_STORAGE = 'EXCEED_MAX_STORAGE';

export const SELECT_TRIAL = 'SELECT_TRIAL';

/**
 * savetrail - Save an audio file
 */
export function saveTrial(trial, count) {
  return (dispatch) => {
    const id = uuid.v4();
    blobToDataURL(trial.blob, dataUrl => {
      trial = {...trial,
        dataUrl,
        title: `Trial #${count + 1}`,
        id
      };
      dispatch({type: SAVE_TRIAL, trial});
    });
  };
}

/**
 * deleteTrial - delete from state and save
 */
export function deleteTrial(trial) {
  return (dispatch) => {
    dispatch({type: DELETE_TRIAL, id: trial.id});
  };
}

/**
 * getAllTrials - Get items from localStorage
 */
export function getTrials() {
  return (dispatch) => {
    dispatch({type: GET_TRIALS});
  };
}

/**
 * removeAllTrials
 */
 export function clearTrials() {
  return (dispatch) => {
    dispatch({type: CLEAR_TRIALS});
  };
}

/**
 * selectTrail
 */
 export function selectTrial(trial) {
  return (dispatch) => {
    dispatch({type: SELECT_TRIAL, trial});
  };
}

