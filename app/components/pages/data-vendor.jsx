var React = require('react');
var Vendor = window.Models.Vendor;
var Helper = require('../helper');

var DataVendor = React.createClass({
  getInitialState: function(){
    return {instances: []};
  },
  componentDidMount: function(){
    var instance = this;
    Vendor
      .findAll()
      .then(function onVendorRetrieveSuccess(vendors){
        console.log('Retrieve all vendors data success!');
        console.log(vendors);
        instance.setState({instances: vendors});
      })
      .catch(function onVendorRetrieveFailed(error){
        console.log('Retrieving vendor failed...');
        console.log(error);
      });
  },

  generateOnItemClick: function(vendorId){
    return function(){
      Helper.call('changePage',['detail-vendor', {instanceId: vendorId}]);
    };
  },

  render: function(){
    var component = this;
    var rows = this.state.instances.map(function(account, index){
      return (
        <tr key={index}>
          <td className="text-center">{index}</td>
          <td className="text-center"><a onClick={this.generateOnItemClick(account.id).bind(component)}><span className="label label-warning">{'V' + account.id}</span></a></td>
          <td>{account.nama} </td>
          <td>{account.alamat}</td>
          <td>{account.alamat}</td>
        </tr>
      );
    }.bind(component));
    return (
      <section className="content">
        <div className="row">
          <div className="col-md-6">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Periode</h3>
              </div>
              <div className="box-body">
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-addon"><i className="fa fa-calendar"></i></div>
                    <input data-widget="calendar-range" className="form-control pull-right"></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <div className="box box-info">
              <div className="box-body">
                <table data-widget="advanced-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">Kode</th>
                      <th className="text-center">Nama</th>
                      <th className="text-center">Alamat</th>
                      <th className="text-center">Telepon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = DataVendor;


// <div data-content="data-vendor" class="content-wrapper hide">
//   <!-- Content Header (Page header) -->
//   <section class="content-header">
//     <h1>
//       Data Vendor
//     </h1>
//     <ol class="breadcrumb">
//       <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
//       <li>Data</li>
//       <li class="active">Vendor</li>
//     </ol>
//   </section>
//
//   <section class="content">
//     <div class="row">
//       <div class="col-md-6">
//         <div class="box">
//           <div class="box-header">
//             <h3 class="box-title">Periode</h3>
//           </div>
//           <div class="box-body">
//             <div class="form-group">
//               <div class="input-group">
//                 <div class="input-group-addon"><i class="fa fa-calendar"></i></div>
//                 <input data-widget="calendar-range" class="form-control pull-right" value="11/01/2015 - 11/30/2015"></input>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div class="row">
//       <div class="col-xs-12">
//         <div class="box box-info">
//           <div class="box-body">
//             <table data-widget="advanced-table" class="table table-bordered table-striped">
//               <thead>
//                 <tr>
//                   <th class="text-center">#</th>
//                   <th class="text-center">Kode</th>
//                   <th class="text-center">Nama</th>
//                   <th class="text-center">Alamat</th>
//                   <th class="text-center">Telepon</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td class="text-center">1</td>
//                   <td class="text-center"><a href="#"><span class="label label-warning">V22</span></a></td>
//                   <td>Ridho</td>
//                   <td>Stasiun Semut</td>
//                   <td>031-5400123</td>
//                 </tr>
//                 <tr>
//                   <td class="text-center">2</td>
//                   <td class="text-center"><a href="#"><span class="label label-warning">V3</span></a></td>
//                   <td>Dede</td>
//                   <td>Mulyorejo I</td>
//                   <td>088877001122</td>
//                 </tr>
//                 <tr>
//                   <td class="text-center">3</td>
//                   <td class="text-center"><a href="#"><span class="label label-warning">V14</span></a></td>
//                   <td>Ditya</td>
//                   <td>Ahmad Yani 10-1</td>
//                   <td>031-52007575</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   </section>
// </div>
