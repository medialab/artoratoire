import {combineReducers} from 'redux';
import {i18nState} from 'redux-i18n';
import playlist from '../containers/PlaylistContainer/reducer';
import recordings from '../containers/RecorderContainer/reducer';


const rootReducer = combineReducers({
  playlist,
  recordings,
  i18nState
});

export default rootReducer;
