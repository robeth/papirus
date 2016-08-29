var Action = require('./actions');
var _ = require('lodash');

var initialState = {
  section: 'login',
  page: {
    name: 'dashboard',
    properties: undefined,
    isSidebarCollapse: false
  }
};

function papirusApp(state, action){
  state = state || initialState;
  switch(action.type){
    case Action.CHANGE_PAGE:
      return _.merge({}, state, {page: action.page});
    case Action.CHANGE_SECTION:
      return _.merge({}, state, {section: action.section});
    case Action.DASHBOARD_SIDEBAR_TOGGLE:
      var nextCollapseState = !state.page.isSidebarCollapse;
      return _.merge({}, state, {page: {isSidebarCollapse: nextCollapseState}});
    default:
      return state;
  }
}

module.exports = papirusApp;
