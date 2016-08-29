var React = require('react');

var Dashboard = React.createClass({
  render: function(){
    return (
      <section className="content">
        <div className="row">
          <div className="col-lg-3 col-xs-6">
            <div className="small-box bg-aqua">
              <div className="inner">
                <h3>225</h3>
                <p>Pembelian</p>
              </div>
              <div className="icon">
                <i className="fa fa-shopping-cart"></i>
              </div>
              <a href="#" className="small-box-footer">Info lengkap <i className="fa fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <div className="col-lg-3 col-xs-6">
            <div className="small-box bg-green">
              <div className="inner">
                <h3>53<sup style={{'fontSize': '20px'}}>%</sup></h3>
                <p>HPP</p>
              </div>
              <div className="icon">
                <i className="fa fa-line-chart"></i>
              </div>
              <a href="#" className="small-box-footer">Info lengkap <i className="fa fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <div className="col-lg-3 col-xs-6">
            <div className="small-box bg-yellow">
              <div className="inner">
                <h3>114</h3>
                <p>Nasabah Individu</p>
              </div>
              <div className="icon">
                <i className="fa fa-child"></i>
              </div>
              <a href="#" className="small-box-footer">Info Lengkap <i className="fa fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <div className="col-lg-3 col-xs-6">
            <div className="small-box bg-red">
              <div className="inner">
                <h3>31</h3>
                <p>Nasabah Kolektif</p>
              </div>
              <div className="icon">
                <i className="fa fa-building"></i>
              </div>
              <a href="#" className="small-box-footer">Info lengkap <i className="fa fa-arrow-circle-right"></i></a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="box box-primary">
              <div className="box-header with-border">
                <h3 className="box-title">Volume Transaksi</h3>
                <div className="box-tools pull-right">
                  <button className="btn btn-box-tool" data-widget="collapse">
                    <i className="fa fa-minus"></i>
                  </button>
                </div>
              </div>
              <div className="box-body">
                <div className="col-md-8">
                  <div>
                    <canvas id="transaction-volume-chart"></canvas>
                  </div>
                </div>
                <div className="col-md-4">
                  <p className="text-center"><strong>Target</strong></p>
                  <div className="progress-group">
                    <span className="progress-text">Pembelian</span>
                    <span className="progress-number"><b>20.000.000</b>/25.000.000</span>
                    <div className="progress sm">
                      <div className="progress-bar progress-bar-aqua" style={{width: '80%'}}></div>
                    </div>
                  </div>
                  <div className="progress-group">
                    <span className="progress-text">Penjualan</span>
                    <span className="progress-number"><b>30.000.000</b>/40.000.000</span>
                    <div className="progress sm">
                      <div className="progress-bar progress-bar-green" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  <div className="progress-group">
                    <span className="progress-text">Biaya</span>
                    <span className="progress-number"><b>5.000.000</b>/10.000.000</span>
                    <div className="progress sm">
                      <div className="progress-bar progress-bar-red" style={{width: '50%'}}></div>
                    </div>
                  </div>
                  <div className="progress-group">
                    <span className="progress-text">Pelunasan Nasabah</span>
                    <span className="progress-number"><b>8.000.000</b>/20.000.000</span>
                    <div className="progress sm">
                      <div className="progress-bar progress-bar-yellow" style={{width: '40%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box-footer">
                <div className="row">
                  <div className="col-sm-3 col-xs-6">
                    <div className="description-block border-right">
                      <span className="description-percentage text-green">
                        <i className="fa fa-caret-up"></i> 10%
                      </span>
                      <h5 className="description-header">Rp 20.000.000</h5>
                      <span className="description-text">Pendapatan Bruto</span>
                    </div>
                  </div>
                  <div className="col-sm-3 col-xs-6">
                    <div className="description-block border-right">
                      <span className="description-percentage text-red">
                        <i className="fa fa-caret-down"></i> 7%
                      </span>
                      <h5 className="description-header">Rp 5.200.000</h5>
                      <span className="description-text">Pendapatan Netto</span>
                    </div>
                  </div>
                  <div className="col-sm-3 col-xs-6">
                    <div className="description-block border-right">
                      <span className="description-percentage text-yellow">
                        <i className="fa fa-caret-left"></i> 0%
                      </span>
                      <h5 className="description-header">Rp 5.000.000</h5>
                      <span className="description-text">Biaya</span>
                    </div>
                  </div>
                  <div className="col-sm-3 col-xs-6">
                    <div className="description-block border-right">
                      <span className="description-percentage text-red">
                        <i className="fa fa-caret-down"></i> 30%
                      </span>
                      <h5 className="description-header">40%</h5>
                      <span className="description-text">Pelunasan Nasabah</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>
    );
  }
});

module.exports = Dashboard;
