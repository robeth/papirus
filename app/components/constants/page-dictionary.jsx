var React = require('react');
var Dashboard = require('./../pages/dashboard');
var DataNasabahIndividu = require('./../pages/data-nasabah-individu');
var FormNasabah = require('./../pages/form-nasabah');

module.exports = {
  'dashboard': {
    title: 'Dashboard',
    element: (<Dashboard/>),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Dashboard', to: 'dashboard'}
    ]
  },
  'data-nasabah-individu': {
    title: 'Data Nasabah Individu',
    element: (<DataNasabahIndividu/>),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Nasabah individu', to: 'data-nasabah-individu'}
    ]
  },
  'form-nasabah': {
    title: 'Form Nasabah',
    element: (<FormNasabah/>),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Form', to : ''},
      { label: 'Nasabah', to: 'form-nasabah'}
    ]
  }
}
