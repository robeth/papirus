var React = require('react');
var Nasabah = window.Models.Nasabah;

var FormNasabah = React.createClass({
  onFormSubmit: function(event){
    event.preventDefault();
    console.log('Submitting form...');
    console.log(Nasabah);
    var type = this.refs['nasabah-type'].value;
    var nama = this.refs['nasabah-nama'].value;
    var ktp = this.refs['nasabah-ktp'].value;
    var alamat = this.refs['nasabah-alamat'].value;

    Nasabah
      .create({
        ktp: ktp,
        nama: nama,
        jenis: type,
        alamat: alamat,
        tanggal_daftar: '2015-12-22'
      })
      .then(function onNasabahCreationSuccess(nasabah){
        console.log("success creating new nasabah!");
        console.log(nasabah);
      })
      .catch(function onNasabahCreationError(error){
        console.log("Failed creating new nasabah...");
        console.log(error);
      });
  },

  render: function(){
    return (
      <section className="content">
        <div className="row">
          <form role="form" className="form-horizontal">
            <div className="col-xs-6">
              <div className="box box-info">
                <div className="box-header with-border">
                  <h3 className="box-title">Informasi Umum</h3>
                </div>
                <div className="box-body">
                  <div className="form-group">
                    <label htmlFor="" className="col-sm-2 control-label">Jenis</label>
                    <div className="col-sm-10">
                      <select ref='nasabah-type' type="text" className="form-control">
                        <option value="individu">Individu</option>
                        <option value="kolektif">Kolektif</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className="col-sm-2 control-label">KTP</label>
                    <div className="col-sm-10"><input ref='nasabah-ktp' type="text" className="form-control"/></div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className="col-sm-2 control-label">Nama</label>
                    <div className="col-sm-10"><input ref='nasabah-nama' type="text" className="form-control"/></div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className="col-sm-2 control-label">Alamat</label>
                    <div className="col-sm-10"><input ref='nasabah-alamat' type="text" className="form-control"/></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-6">
              <div className="box box-info">
                <div className="box-header with-border">
                  <h3 className="box-title">Informasi Tambahan</h3>
                </div>
                <div className="box-body">
                  <div className="form-group">
                    <label htmlFor="" className="col-sm-2 control-label">Nama PJ</label>
                    <div className="col-sm-10"><input ref='nasabah-pj' type="text" className="form-control"/></div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className="col-sm-2 control-label">No Induk</label>
                    <div className="col-sm-10"><input ref='nasabah-no-induk' type="text" className="form-control"/></div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className="col-sm-2 control-label">Telepon</label>
                    <div className="col-sm-10"><input ref='nasabah-telepon' type="text" className="form-control"/></div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className="col-sm-2 control-label">Tanggal Lahir</label>
                    <div className="col-sm-10"><input ref='nasabah-tanggal-lahir' type="text" className="form-control" data-widget="calendar-single"/></div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className="col-sm-2 control-label">Email</label>
                    <div className="col-sm-10"><input ref='nasabah-email' type="text" className="form-control"/></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12"><button className="btn btn-info btn-lg pull-right" onClick={this.onFormSubmit}><i className="fa fa-save"></i> Selesai</button></div>
          </form>
        </div>
      </section>
    );
  }
});

module.exports = FormNasabah;
