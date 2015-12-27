var React = require('react');
var Dashboard = require('./../pages/dashboard');
var DataNasabahIndividu = require('./../pages/data-nasabah-individu');
var FormNasabah = require('./../pages/form-nasabah');
var DetailNasabah = require('./../pages/detail-nasabah');
var FormPembelian = require('./../pages/form-pembelian');

module.exports = {
  'dashboard': {
    title: 'Dashboard',
    element: React.createFactory(Dashboard),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Dashboard', to: 'dashboard'}
    ]
  },
  'data-nasabah-individu': {
    title: 'Data Nasabah Individu',
    element: React.createFactory(DataNasabahIndividu),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Nasabah individu', to: 'data-nasabah-individu'}
    ]
  },
  'form-nasabah': {
    title: 'Form Nasabah',
    element: React.createFactory(FormNasabah),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Form', to : ''},
      { label: 'Nasabah', to: 'form-nasabah'}
    ]
  },
  'detail-nasabah': {
    title: 'Detail Nasabah',
    element: React.createFactory(DetailNasabah),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Nasabah', to : ''},
      { label: 'Nasabah', to: 'xxx'}
    ]
  },
  'form-pembelian': {
    title: 'Form Pembelian',
    element: React.createFactory(FormPembelian),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Form', to : ''},
      { label: 'Pembelian', to: 'form-pembelian'}
    ]
  }
}
