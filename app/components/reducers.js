var Action = require('./actions');
var _ = require('lodash');

var initialState = {
  section: 'LOGIN',
  page: {
    name: 'dashboard',
    properties: undefined
  }
};

function papirusApp(state, action){
  state = state || initialState;
  switch(action.type){
    case Action.CHANGE_PAGE:
      return _.merge({}, state, {page: action.page});
    case Action.CHANGE_SECTION:
      return _.merge({}, state, {section: action.section});
    default:
      return state;
  }
}

module.exports = papirusApp;
