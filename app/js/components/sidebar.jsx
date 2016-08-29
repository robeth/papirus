var React = require('react');
var PageLink = require('./page-link');
var SectionLink = require('./section-link');

var Sidebar = React.createClass({
  render: function(){
    return (
      <aside className="main-sidebar">
        <section className="sidebar">
          <ul className="sidebar-menu">
            <li className="active treeview">
              <PageLink to='dashboard'>
                <i className="fa fa-dashboard"></i> <span>Dashboard</span>
              </PageLink>
            </li>

            <li className="treeview">
              <a href="#" id="menu-data">
                <i className="fa fa-laptop"></i>
                <span>Data</span>
                <i className="fa fa-angle-left pull-right"></i>
              </a>
              <ul className="treeview-menu">
                <li>
                  <a href="#" id="menu-data-nasabah">
                    <i className="fa fa-users"></i> Nasabah
                    <i className="fa fa-angle-left pull-right"></i>
                  </a>
                  <ul className="treeview-menu">
                    <li><PageLink to='data-nasabah-individu'><i className="fa fa-child"></i> Individu</PageLink></li>
                    <li><PageLink to='data-nasabah-kolektif'><i className="fa fa-building"></i> Kolektif</PageLink></li>
                  </ul>
                </li>
                <li><PageLink to='data-vendor'><i className="fa fa-truck"></i> Vendor</PageLink></li>
                <li><PageLink to='data-barang'><i className="fa fa-rocket"></i> Barang</PageLink></li>
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
                <li><PageLink to='data-pembelian'><i className="fa fa-arrow-right"></i> Pembelian</PageLink></li>
                <li><PageLink to='data-penjualan'><i className="fa fa-arrow-left"></i> Penjualan</PageLink></li>
                <li><PageLink to='data-konversi'><i className="fa fa-recycle"></i> Konversi</PageLink></li>
                <li><PageLink to='data-penarikan'><i className="fa fa-hand-lizard-o"></i> Penarikan</PageLink></li>
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
                <li><PageLink to='laporan-arus-barang'><i className="fa fa-exchange"></i> Arus Barang</PageLink></li>
                <li><PageLink to='laporan-utang'><i className="fa fa-credit-card"></i> Utang Nasabah</PageLink></li>
                <li><PageLink to='laporan-tonase'><i className="fa fa-shopping-cart"></i> Tonase Nasabah</PageLink></li>
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
