var React = require('react');

var Sidebar = React.createClass({
  propTypes: {
    onItemClick: React.PropTypes.func.isRequired
  },
  _generateOnItemClick: function(argument){
    return function(){return this.props.onItemClick(argument)}.bind(this);
  },
  render: function(){
    return (
      <aside className="main-sidebar">
        <section className="sidebar">
          <ul className="sidebar-menu">
            <li className="active treeview">
              <a href="#" data-link="dashboard" onClick={this._generateOnItemClick('dashboard')}>
                <i className="fa fa-dashboard"></i> <span>Dashboard</span>
              </a>
            </li>

            <li className="treeview">
              <a href="#">
                <i className="fa fa-laptop"></i>
                <span>Data</span>
                <i className="fa fa-angle-left pull-right"></i>
              </a>
              <ul className="treeview-menu">
                <li>
                  <a href="#">
                    <i className="fa fa-users"></i> Nasabah
                    <i className="fa fa-angle-left pull-right"></i>
                  </a>
                  <ul className="treeview-menu">
                    <li><a href="#" data-link="data-nasabah-individu" onClick={this._generateOnItemClick('data-nasabah-individu')}><i className="fa fa-child"></i> Individu</a></li>
                    <li><a href="#" data-link="data-nasabah-kolektif"><i className="fa fa-building"></i> Kolektif</a></li>
                  </ul>
                </li>
                <li><a href="#" data-link="data-vendor"><i className="fa fa-truck"></i> Vendor</a></li>
                <li><a href="#" data-link="data-barang"><i className="fa fa-rocket"></i> Barang</a></li>
                <li>
                  <a href="#">
                    <i className="fa fa-dollar"></i> Keuangan
                    <i className="fa fa-angle-left pull-right"></i>
                  </a>
                  <ul className="treeview-menu">
                    <li><a href="#" data-link="data-keuangan-kas"><i className="fa fa-money"></i> Kas</a></li>
                    <li><a href="#" data-link="data-keuangan-transaksi"><i className="fa fa-file"></i> Transaksi</a></li>
                    <li><a href="#" data-link="data-keuangan-kategori"><i className="fa fa-list-ol"></i> Kategori</a></li>
                  </ul>
                </li>
                <li><a href="#" data-link="data-pembelian"><i className="fa fa-arrow-right"></i> Pembelian</a></li>
                <li><a href="#" data-link="data-penjualan"><i className="fa fa-arrow-left"></i> Penjualan</a></li>
                <li><a href="#" data-link="data-konversi"><i className="fa fa-recycle"></i> Konversi</a></li>
                <li><a href="#" data-link="data-penarikan"><i className="fa fa-hand-lizard-o"></i> Penarikan</a></li>
              </ul>
            </li>

            <li className="treeview">
              <a href="#">
                <i className="fa fa-edit"></i> <span>Form</span>
                <i className="fa fa-angle-left pull-right"></i>
              </a>
              <ul className="treeview-menu">
                <li><a href="#" data-link="form-pembelian" onClick={this._generateOnItemClick('form-pembelian')}><i className="fa fa-arrow-right"></i> Pembelian</a></li>
                <li><a href="#" data-link="form-penjualan"><i className="fa fa-arrow-left"></i> Penjualan</a></li>
                <li><a href="#" data-link="form-konversi"><i className="fa fa-recycle"></i> Konversi</a></li>
                <li><a href="#" data-link="form-penarikan"><i className="fa fa-hand-lizard-o"></i> Penarikan</a></li>
                <li><a href="#" data-link="form-transaksi"><i className="fa fa-file"></i> Transaksi</a></li>
                <li><a href="#" data-link="form-nasabah" onClick={this._generateOnItemClick('form-nasabah')}><i className="fa fa-users"></i> Nasabah</a></li>
                <li><a href="#" data-link="form-vendor"><i className="fa fa-truck"></i> Vendor</a></li>
                <li><a href="#" data-link="form-kategori-transaksi"><i className="fa fa-list-ol"></i> Kategori Transaksi</a></li>
              </ul>
            </li>

            <li className="treeview">
              <a href="#">
                <i className="fa fa-files-o"></i>
                <span>Laporan</span>
                <i className="fa fa-angle-left pull-right"></i>
              </a>
              <ul className="treeview-menu">
                <li><a href="#" data-link="laporan-laba-rugi"><i className="fa fa-balance-scale"></i> Laba Rugi</a></li>
                <li><a href="#" data-link="laporan-buku-besar"><i className="fa fa-book"></i> Buku Besar</a></li>
                <li><a href="#" data-link="laporan-arus-barang"><i className="fa fa-exchange"></i> Arus Barang</a></li>
                <li>
                  <a href="#">
                    <i className="fa fa-credit-card"></i> Utang Nasabah
                    <i className="fa fa-angle-left pull-right"></i>
                  </a>
                  <ul className="treeview-menu">
                    <li><a href="#" data-link="laporan-utang-individu"><i className="fa fa-child"></i> Individu</a></li>
                    <li><a href="#" data-link="laporan-utang-kolektif"><i className="fa fa-building"></i> Kolektif</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-shopping-cart"></i> Tonase Nasabah
                    <i className="fa fa-angle-left pull-right"></i>
                  </a>
                  <ul className="treeview-menu">
                    <li><a href="#" data-link="laporan-tonase-individu"><i className="fa fa-child"></i> Individu</a></li>
                    <li><a href="#" data-link="laporan-tonase-kolektif"><i className="fa fa-building"></i> Kolektif</a></li>
                  </ul>
                </li>
              </ul>
            </li>

            <li className="treeview">
              <a href="#">
                <i className="fa fa-pie-chart"></i>
                <span>Statistik</span>
                <i className="fa fa-angle-left pull-right"></i>
              </a>
              <ul className="treeview-menu">
                <li><a href="#"><i className="fa fa-users"></i> Nasabah</a></li>
                <li><a href="#"><i className="fa fa-rocket"></i> Barang</a></li>
                <li><a href="#"><i className="fa fa-dollar"></i> Keuangan</a></li>
              </ul>
            </li>

            <li className="treeview">
              <a href="#">
                <i className="fa fa-gears"></i> <span>Konfigurasi</span>
                <i className="fa fa-angle-left pull-right"></i>
              </a>
              <ul className="treeview-menu">
                <li><a href="#"><i className="fa fa-database"></i> Database</a></li>
                <li><a href="#"><i className="fa fa-users"></i> User</a></li>
                <li><a href="#"><i className="fa fa-eyedropper"></i> Tema</a></li>
              </ul>
            </li>
          </ul>
        </section>
      </aside>
    );
  }
});

module.exports =  Sidebar;
