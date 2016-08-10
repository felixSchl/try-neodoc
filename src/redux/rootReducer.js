import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import editor from './modules/editor';
import neodoc from './modules/neodoc';

export default combineReducers({
  router,
  editor,
  neodoc
});
