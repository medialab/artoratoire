import {SAVE_TRIAL, DELETE_TRIAL, GET_TRIALS, INIT_TRIALS, CLEAR_TRIALS, EXCEED_MAX_STORAGE} from '../containers/TrialsContainer/actions';
import {SAVE_USER_SPEECHES, GET_USER_SPEECHES, INIT_USER_SPEECHES} from '../containers/PlaylistContainer/actions';


export default function localStorageMiddleware({dispatch, getState}) {
  return next => action => {
    // next(action);
    if (action.type === SAVE_TRIAL) {
      // save the whole list trials first
      try {
        const prevTrials = getState().trials.list;
        const newTrials = prevTrials.slice();
        newTrials.splice(0, 0, action.trial);
        localStorage.setItem('trials', JSON.stringify(newTrials));
      }
      catch (err) {
        // if exceed max quota
        console.log(err);
        dispatch({type: EXCEED_MAX_STORAGE});
        return;
      }
    }

    if (action.type === SAVE_USER_SPEECHES) {
      try {
        const prevSpeeches = getState().playlist.userSpeeches.list;
        const newSpeeches = prevSpeeches.slice();
        newSpeeches.splice(0, 0, action.speech);

        localStorage.setItem('userSpeeches', JSON.stringify(newSpeeches));
      }
      catch (err) {
        // if exceed max quota
        console.log(err);
        dispatch({type: EXCEED_MAX_STORAGE});
        return;
      }
    }

    if (action.type === GET_USER_SPEECHES) {
      try {
        const speeches = JSON.parse(localStorage.getItem('userSpeeches'));
          if (speeches !== null) {
            dispatch({type: INIT_USER_SPEECHES, speeches});
          }
        }
      catch (err) {
        console.log(err);
      }
    }

    if (action.type === GET_TRIALS) {
      try {
        const trials = JSON.parse(localStorage.getItem('trials'));
        if (trials !== null) {
          const list = trials.sort((a, b) => {
            return b.startTime - a.startTime;
          });
          dispatch({type: INIT_TRIALS, list});
        }
      }
      catch (err) {
        console.log(err);
      }
    }

    if (action.type === CLEAR_TRIALS) {
      try {
        localStorage.removeItem('trials');
      }
      catch (err) {
        console.log(err);
      }
    }

    next(action);

    if (action.type === DELETE_TRIAL) {
      const trials = getState().trials.list;
      try {
        localStorage.setItem('trials', JSON.stringify(trials));
      }
      catch (err) {
        console.log(err);
      }
    }
  };
}
