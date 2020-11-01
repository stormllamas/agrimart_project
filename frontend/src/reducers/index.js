import { combineReducers } from 'redux';

import auth from './auth';
import siteConfig from './siteConfig';
import layout from './layout';

import articles from './pages/articles';
import events from './pages/events';
import services from './pages/services';
import contact from './pages/contact';

import logistics from './logistics';

import manager from './manager';

export default combineReducers({
  auth,
  siteConfig,
  layout,

  articles,
  events,
  services,
  contact,

  logistics,

  manager,
});