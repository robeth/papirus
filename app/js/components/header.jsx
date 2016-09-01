var React = require('react');
var ReactRedux = require('react-redux');
var Actions = require('./actions');
var PageLink = require('./page-link');
var SectionLink = require('./section-link');

var Header = React.createClass({
  render: function(){
    return(
      <header className="main-header">
        <a href="#" className="logo">
          <span className="logo-mini"><b>BS</b>BM</span>
          <span className="logo-lg"><b>Bina</b>Mandiri</span>
        </a>
        <nav className="navbar navbar-static-top" role="navigation">
          <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button" onClick={this.props.onToggle}>
            <span className="sr-only">Toggle navigation</span>
          </a>
          <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              <li className="dropdown notifications-menu action-menu">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="fa fa-plus-square"></i>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <ul className="menu" style={{height: 300}}>
                      <li>
                        <PageLink to='form-pembelian'>
                          <i className="fa fa-arrow-right"></i> Pembelian
                        </PageLink>
                      </li>
                      <li>
                        <PageLink to='form-penjualan'>
                          <i className="fa fa-arrow-left"></i> Penjualan
                        </PageLink>
                      </li>
                      <li>
                        <PageLink to='form-konversi'>
                          <i className="fa fa-recycle"></i> Konversi
                        </PageLink>
                      </li>
                      <li>
                        <PageLink to='form-penarikan'>
                          <i className="fa fa-hand-lizard-o"></i> Penarikan
                        </PageLink>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-file"></i> Transaksi
                        </a>
                      </li>
                      <li>
                        <PageLink to='form-nasabah'>
                          <i className="fa fa-users"></i> Nasabah
                        </PageLink>
                      </li>
                      <li>
                        <PageLink to='form-vendor'>
                          <i className="fa fa-truck"></i> Vendor
                        </PageLink>
                      </li>
                      <li>
                        <PageLink to='form-barang'>
                          <i className="fa fa-rocket"></i> Barang
                        </PageLink>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-list-ol"></i> Kategori Barang
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className="logout-menu">
                <SectionLink to='login'>
                  <i className="fa fa-power-off"></i> <span>Logout</span>
                </SectionLink>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
});

function mapDispatchToProps(dispatch, ownProps){
  return {
    onToggle: function(){
      console.log("On Toggle");
      dispatch(Actions.dashboardSidebarToggle());
    }
  }
}

var HeaderContainer = ReactRedux.connect(null, mapDispatchToProps)(Header);

module.exports = HeaderContainer;
