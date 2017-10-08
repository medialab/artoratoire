import {combineReducers} from 'redux';
import {i18nState} from 'redux-i18n';
import playlist from '../containers/PlaylistContainer/reducer';
import trials from '../containers/TrialsContainer/reducer';


const rootReducer = combineReducers({
  playlist,
  trials,
  i18nState
});

export default rootReducer;
