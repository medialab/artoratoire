import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import localStorageMiddleware from '../middlewares/localstorage';


const createStoreWithMiddleware = compose(
  applyMiddleware(
    localStorageMiddleware,
    thunk
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);


export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
