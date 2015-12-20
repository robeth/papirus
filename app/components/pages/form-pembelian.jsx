<div data-content="form-pembelian" class="content-wrapper hide">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      Form Pembelian
    </h1>
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
      <li>Data</li>
      <li class="active">Pembelian</li>
    </ol>
  </section>

  <section class="content">
    <div class="row">
      <form role="form" class="form-horizontal">
        <div class="col-xs-12">
          <div class="box box-info">
            <div class="box-header with-border">
              <h3 class="box-title">Informasi Umum</h3>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label for="" class="col-sm-2 control-label">Tanggal</label>
                <div class="col-sm-10"><input type="text" class="form-control" data-widget="calendar-single"></div>
              </div>
              <div class="form-group">
                <label for="" class="col-sm-2 control-label">Nota</label>
                <div class="col-sm-10"><input type="text" class="form-control"></div>
              </div>
              <div class="form-group">
                <label for="" class="col-sm-2 control-label">Nasabah</label>
                <div class="col-sm-10">
                  <select select-type="pembelian-nasabah" type="text" class="form-control" style="width: 100%"></select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xs-12">
          <div class="box box-info">
            <div class="box-header with-border">
              <h3 class="box-title">Daftar Barang</h3>
            </div>
            <div class="box-body">
              <div class="row">
                <div class="col-xs-3 text-center">Kategori</div>
                <div class="col-xs-3 text-center">Unit</div>
                <div class="col-xs-3 text-center">Harga per Unit</div>
              </div>
              <div class="row" category-item="true">
                <div class="col-xs-3"><select select-type="form-pembelian-category" class="form-control" style="width: 100%"></select></div>
                <div class="col-xs-3">
                  <div class="input-group">
                    <input type="text" class="form-control"><span class="input-group-addon">Kg</span>
                  </div>
                </div>
                <div class="col-xs-3"><input type="text" class="form-control"></div>
              </div>
              <div class="row" category-item="true">
                <div class="col-xs-3"><select select-type="form-pembelian-category" class="form-control" style="width: 100%"></select></div>
                <div class="col-xs-3">
                  <div class="input-group">
                    <input type="text" class="form-control"><span class="input-group-addon">Kg</span>
                  </div>
                </div>
                <div class="col-xs-3"><input type="text" class="form-control"></div>
              </div>
            </div>
            <div class="box-footer">
              <button class="btn btn-info pull-right">Selesai</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>
</div>
