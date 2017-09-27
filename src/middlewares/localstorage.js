import {SAVE_RECORDING, GET_RECORDINGS, INIT_RECORDINGS, CLEAR_RECORDINGS, EXCEED_MAX_STORAGE} from '../containers/RecorderContainer/actions';


export default function localStorageMiddleware({dispatch, getState}) {
  return next => action => {
    // next(action);
    if (action.type === SAVE_RECORDING) {
      // save the whole list recordings first
      try {
        const prevRecordings = getState().recordings.list;
        const newRecordings = prevRecordings.slice();
        newRecordings.splice(0, 0, action.recording);

        localStorage.setItem('recordings', JSON.stringify(newRecordings));
      }
      catch (err) {
        // if exceed max quota
        console.log(err);
        dispatch({type: EXCEED_MAX_STORAGE});
        return;
      }
    }
    if (action.type === GET_RECORDINGS) {
      try {
        const recordings = JSON.parse(localStorage.getItem('recordings'));
        if (recordings !== null) {
          const list = recordings.sort((a, b) => {
            return b.startTime - a.startTime;
          });
          dispatch({type: INIT_RECORDINGS, list});
        }
      }
      catch (err) {
        console.log(err);
      }
    }
    if (action.type === CLEAR_RECORDINGS) {
      try {
        localStorage.removeItem('recordings');
      }
      catch (err) {
        console.log(err);
      }
    }
    next(action);
  };
}
