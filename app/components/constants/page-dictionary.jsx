var React = require('react');
var Dashboard = require('./../pages/dashboard');
var DataNasabahIndividu = require('./../pages/data-nasabah-individu');
var DataNasabahKolektif = require('./../pages/data-nasabah-kolektif');
var FormNasabah = require('./../pages/form-nasabah');
var DetailNasabah = require('./../pages/detail-nasabah');
var FormPembelian = require('./../pages/form-pembelian');
var DataPembelian = require('./../pages/data-pembelian');
var DetailPembelian = require('./../pages/detail-pembelian');
var VendorForm = require('./../pages/form-vendor');
var VendorDetail = require('./../pages/detail-vendor');
var VendorData = require('./../pages/data-vendor');
var PenjualanForm = require('./../pages/form-penjualan');
var PenjualanData = require('./../pages/data-penjualan');
var PenjualanDetail = require('./../pages/detail-penjualan');
var CategoryData = require('./../pages/data-barang');
var CategoryForm = require('./../pages/form-barang');
var CategoryDetail = require('./../pages/detail-barang');
var KonversiForm = require('./../pages/form-konversi');
var KonversiData = require('./../pages/data-konversi');
var KonversiDetail = require('./../pages/detail-konversi');
var PenarikanForm = require('./../pages/form-penarikan');

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
  'data-nasabah-kolektif': {
    title: 'Data Nasabah Kolektif',
    element: React.createFactory(DataNasabahKolektif),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Nasabah Kolektif', to: 'data-nasabah-kolektif'}
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
  },
  'data-pembelian': {
    title: 'Data Pembelian',
    element: React.createFactory(DataPembelian),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Pembelian', to: 'xxx'}
    ]
  },
  'detail-pembelian': {
    title: 'Detail Pembelian',
    element: React.createFactory(DetailPembelian),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Pembelian', to: 'xxx'}
    ]
  },
  'form-vendor': {
    title: 'Form Vendor',
    element: React.createFactory(VendorForm),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Form', to : ''},
      { label: 'Vendor', to: 'form-vendor'}
    ]
  },
  'data-vendor': {
    title: 'Data Vendor',
    element: React.createFactory(VendorData),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Vendor', to: 'data-vendor'}
    ]
  },
  'detail-vendor': {
    title: 'Detail Vendor',
    element: React.createFactory(VendorDetail),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Vendor', to: 'form-vendor'}
    ]
  },
  'form-penjualan': {
    title: 'Form Penjualan',
    element: React.createFactory(PenjualanForm),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Form', to : ''},
      { label: 'Penjualan', to: 'form-penjualan'}
    ]
  },
  'data-penjualan': {
    title: 'Data Penjualan',
    element: React.createFactory(PenjualanData),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Penjualan', to: 'data-penjualan'}
    ]
  },
  'detail-penjualan': {
    title: 'Detail Penjualan',
    element: React.createFactory(PenjualanDetail),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Penjualan', to: 'form-penjualan'}
    ]
  },
  'data-barang': {
    title: 'Data Kategori Barang',
    element: React.createFactory(CategoryData),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Barang', to: 'data-barang'}
    ]
  },
  'form-barang': {
    title: 'Form Kategori Barang',
    element: React.createFactory(CategoryForm),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Form', to : ''},
      { label: 'Barang', to: 'form-barang'}
    ]
  },
  'detail-barang': {
    title: 'Detail Kategori Barang',
    element: React.createFactory(CategoryDetail),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Barang', to: 'detail-barang'}
    ]
  },
  'form-konversi': {
    title: 'Form Konversi',
    element: React.createFactory(KonversiForm),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Form', to : ''},
      { label: 'Konversi', to: 'form-konversi'}
    ]
  },
  'data-konversi': {
    title: 'Data Konversi',
    element: React.createFactory(KonversiData),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Barang', to: 'data-konversi'}
    ]
  },
  'detail-konversi': {
    title: 'Detail Konversi',
    element: React.createFactory(KonversiDetail),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Data', to : ''},
      { label: 'Barang', to: 'detail-konversi'}
    ]
  },
  'form-penarikan': {
    title: 'Form Penarikan',
    element: React.createFactory(PenarikanForm),
    path: [
      { label: 'Home', to: 'dashboard'},
      { label: 'Form', to : ''},
      { label: 'Penarikan', to: 'form-penarikan'}
    ]
  }
}
