import {combineReducers} from 'redux';
import {i18nState} from 'redux-i18n';
import playlist from '../containers/PlaylistContainer/reducer';

const rootReducer = combineReducers({
  playlist,
  i18nState
});

export default rootReducer;
