var React = require('react');
var Kategori = window.Models.Kategori;
var LinkHelper = require('../helpers/link-helper');

var CategoryRow = React.createClass({
  propTypes: {
    index: React.PropTypes.number.isRequired,
    instance: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {
      reportCategory: {
        nama: null
      }
    };
  },

  componentDidMount: function(){
    var component = this;
    component.props.instance.getReportCategory()
      .then(function onReportCategoryFound(reportCategory){
        component.setState({
          reportCategory: reportCategory
        });
      })
      .catch(function(error){
        console.log('DataBarang-Row-Error retrieving report category');
        console.log(error);
      });
  },

  render: function(){
    return (
      <tr>
        <td className="text-center">{this.props.index + 1}</td>
        <td className="text-center">
          <LinkHelper.Category
            categoryId={this.props.instance.id}
            categoryCode={this.props.instance.kode}
            />
        </td>
        <td>{this.props.instance.nama} </td>
        <td>{this.state.reportCategory.nama}</td>
        <td className="text-center">{this.props.instance.stabil}</td>
        <td className="text-center">{this.props.instance.fluktuatif}</td>
        <td className="text-center">{this.props.instance.satuan}</td>
      </tr>
    );
  }
});

var DataKategori = React.createClass({
  getInitialState: function(){
    return {instances: []};
  },
  componentDidMount: function(){
    var instance = this;
    Kategori
      .findAll()
      .then(function onKategoriRetrieveSuccess(categories){
        console.log('Retrieve all categories data success!');
        console.log(categories);
        instance.setState({instances: categories});
      })
      .catch(function onKategoriRetrieveFailed(error){
        console.log('Retrieving category failed...');
        console.log(error);
      });
  },

  render: function(){
    var component = this;
    var rows = this.state.instances.map(function(category, index){
      return <CategoryRow key={category.id} instance={category} index={index}/>;
    });
    return (
      <section className="content">
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
                      <th className="text-center">Jenis</th>
                      <th className="text-center">Harga Normal</th>
                      <th className="text-center">Harga Fluktuatif</th>
                      <th className="text-center">Satuan</th>
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

module.exports = DataKategori;
