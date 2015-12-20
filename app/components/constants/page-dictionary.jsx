var React = require('react');
var Dashboard = require('./../pages/dashboard');
var DataNasabahIndividu = require('./../pages/data-nasabah-individu');

module.exports = {
  "dashboard": {
    title: 'Dashboard',
    element: (<Dashboard/>),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Dashboard', to: 'dashboard'}
    ]
  },
  "data-nasabah-individu": {
    title: 'Data Nasabah Individu',
    element: (<DataNasabahIndividu/>),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Nasabah individu', to: 'data-nasabah-individu'}
    ]
  }
}
