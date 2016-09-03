var Action = require('./actions');
var _ = require('lodash');
var PageDictionary = require('./constants/page-dictionary');

var initialState = {
  section: 'main',
  page: {
    name: 'dashboard',
    properties: undefined,
    isSidebarCollapse: false
  }
};

function isValidState(state){
  return state.page.name ? true : false;
}

function papirusApp(state, action){
  var oldState = state || initialState;
  var newState = null;

  switch(action.type){
    case Action.CHANGE_PAGE:
      newState = _.merge({}, oldState, {page: action.page});
      break;
    case Action.CHANGE_SECTION:
      newState = _.merge({}, oldState, {section: action.section});
      break;
    case Action.DASHBOARD_SIDEBAR_TOGGLE:
      var nextCollapseState = !oldState.page.isSidebarCollapse;
      newState = _.merge({}, oldState, {page: {isSidebarCollapse: nextCollapseState}});
      break;
    default:
      newState = oldState;
      break;
  }
  return isValidState(newState) ? newState : oldState;
}

module.exports = papirusApp;
