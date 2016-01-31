var React = require('react');
var Box = require('../box.jsx');
var KonversiForm = require('../forms/konversi');

var KonversiFormPage = React.createClass({
  render: function(){
    return (
      <section className="content">
        <KonversiForm mode='add'/>
      </section>
    );
  }
});

module.exports = KonversiFormPage;
// <div data-content="form-konversi" class="content-wrapper hide">
//   <!-- Content Header (Page header) -->
//   <section class="content-header">
//     <h1>
//       Form Konversi
//     </h1>
//     <ol class="breadcrumb">
//       <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
//       <li>Form</li>
//       <li class="active">Konversi</li>
//     </ol>
//   </section>
//
//   <section class="content">
//     <div class="row">
//       <form role="form" class="form-horizontal">
//         <div class="col-xs-12">
//           <div class="box box-info">
//             <div class="box-header with-border">
//               <h3 class="box-title">Informasi Umum</h3>
//             </div>
//             <div class="box-body">
//               <div class="form-group">
//                 <label for="" class="col-sm-2 control-label">Tanggal</label>
//                 <div class="col-sm-10"><input type="text" class="form-control" data-widget="calendar-single"></div>
//               </div>
//               <div class="form-group">
//                 <label for="" class="col-sm-2 control-label">Nota</label>
//                 <div class="col-sm-10"><input type="text" class="form-control"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//
//         <!-- Daftar Input -->
//         <div class="col-xs-6">
//           <div class="box box-success">
//             <div class="box-header with-border">
//               <h3 class="box-title">Daftar Input</h3>
//             </div>
//             <div class="box-body">
//               <div class="row">
//                 <div class="col-xs-6 text-center">Kategori</div>
//                 <div class="col-xs-6 text-center">Unit</div>
//               </div>
//               <div class="row" category-item="true">
//                 <div class="col-xs-6"><select select-type="form-penjualan-category" class="form-control" style="width: 100%"></select></div>
//                 <div class="col-xs-6">
//                   <div class="input-group">
//                     <input type="text" class="form-control" placeholder="stok: 35"><span class="input-group-addon">Kg</span>
//                   </div>
//                 </div>
//               </div>
//               <div class="row" category-item="true">
//                 <div class="col-xs-6"><select select-type="form-penjualan-category" class="form-control" style="width: 100%"></select></div>
//                 <div class="col-xs-6">
//                   <div class="input-group">
//                     <input type="text" class="form-control" placeholder="stok: 10"><span class="input-group-addon">Kg</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//
//         <!-- Daftar Output -->
//         <div class="col-xs-6">
//           <div class="box box-danger">
//             <div class="box-header with-border">
//               <h3 class="box-title">Daftar Ouput</h3>
//             </div>
//             <div class="box-body">
//               <div class="row">
//                 <div class="col-xs-6 text-center">Kategori</div>
//                 <div class="col-xs-6 text-center">Unit</div>
//               </div>
//               <div class="row" category-item="true">
//                 <div class="col-xs-6"><select select-type="form-penjualan-category" class="form-control" style="width: 100%"></select></div>
//                 <div class="col-xs-6">
//                   <div class="input-group">
//                     <input type="text" class="form-control"><span class="input-group-addon">Kg</span>
//                   </div>
//                 </div>
//               </div>
//               <div class="row" category-item="true">
//                 <div class="col-xs-6"><select select-type="form-penjualan-category" class="form-control" style="width: 100%"></select></div>
//                 <div class="col-xs-6">
//                   <div class="input-group">
//                     <input type="text" class="form-control"><span class="input-group-addon">Kg</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//
//         <div class="col-xs-12"><button class="btn btn-info btn-lg pull-right">Selesai</button></div>
//       </form>
//     </div>
//   </section>
// </div>
