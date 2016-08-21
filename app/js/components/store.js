var Redux = require('redux');
var Reducer = require('./reducers');

module.exports = Redux.createStore(Reducer);
