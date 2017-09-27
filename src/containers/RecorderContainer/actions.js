import {blobToDataURL} from '../../utils/blobConverter';
import uuid from 'uuid';

// Actions

export const SAVE_RECORDING = 'SAVE_RECORDING';
export const CLEAR_RECORDINGS = 'CLEAR_RECORDINGS';
export const GET_RECORDINGS = 'GET_RECORDINGS';
export const INIT_RECORDINGS = 'INIT_RECORDINGS';
export const EXCEED_MAX_STORAGE = 'EXCEED_MAX_STORAGE';

/**
 * saveRecording - Save an audio file
 */
export function saveRecording(recording, count) {
  return (dispatch) => {
    // const {count} = getState().recordings;
    const id = uuid.v4();
    blobToDataURL(recording.blob, dataUrl => {
      recording = {...recording,
        dataUrl,
        title: `Trial #${count + 1}`,
        id
      };
      dispatch({type: SAVE_RECORDING, recording});
    });
  };
}

/**
 * getAllRecordings - Get items from localStorage
 */
export function getRecordings() {
  return (dispatch) => {
    dispatch({type: GET_RECORDINGS});
  };
}

/**
 * removeAllRecordings
 */
 export function clearRecordings() {
  return (dispatch) => {
    dispatch({type: CLEAR_RECORDINGS});
  };
}

