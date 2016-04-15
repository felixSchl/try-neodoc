import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import neodoc from './modules/neodoc';

export default combineReducers({
  router,
  neodoc
});
