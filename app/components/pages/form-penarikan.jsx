<div data-content="form-penarikan" class="content-wrapper hide">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      Form Penarikan
    </h1>
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
      <li>Form</li>
      <li class="active">Penarikan</li>
    </ol>
  </section>

  <section class="content">
    <div class="row">
      <form role="form" class="form-horizontal">
        <div class="col-xs-6">
          <div class="box box-info">
            <div class="box-body">
              <div class="form-group">
                <label for="" class="col-sm-2 control-label">Nasabah</label>
                <div class="col-sm-10">
                  <select type="text" class="form-control" select-type="pembelian-nasabah" style="width: 100%"></select>
                </div>
              </div>
              <div class="form-group">
                <label for="" class="col-sm-2 control-label">Nota</label>
                <div class="col-sm-10"><input type="text" class="form-control"></div>
              </div>
              <div class="form-group">
                <label for="" class="col-sm-2 control-label">Total</label>
                <div class="col-sm-10"><input type="text" class="form-control"></div>
              </div>
              <div class="form-group">
                <label for="" class="col-sm-2 control-label">Tanggal</label>
                <div class="col-sm-10"><input type="text" class="form-control" data-widget="calendar-single"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xs-6">
          <div class="box box-info">
            <div class="box-header with-border">
              <h3 class="box-title">Daftar Pembelian</h3>
            </div>
            <div class="box-body">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th class="text-center">Kode</th>
                    <th class="text-center">Tanggal</th>
                    <th class="text-center">Belum Lunas</th>
                    <th class="text-center">Total Nilai</th>
                    <th class="text-center">Akan Lunas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center"><span class="label label-info">B100</span></td>
                    <td class="text-center">2015-12-01</td>
                    <td class="text-right">10.000,00</td>
                    <td class="text-right">20.000,00</td>
                    <td class="text-right"></td>
                  </tr>
                  <tr>
                    <td class="text-center"><span class="label label-info">B110</span></td>
                    <td class="text-center">2015-12-02</td>
                    <td class="text-right">5.000,00</td>
                    <td class="text-right">5.000,00</td>
                    <td class="text-right"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-xs-12"><button class="btn btn-info btn-lg pull-right"><i class="fa fa-save"></i> Selesai</button></div>
      </form>
    </div>
  </section>
</div>
