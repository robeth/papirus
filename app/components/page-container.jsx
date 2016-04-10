var React = require('react');
var ReactRedux = require('react-redux');
var Breadcrumbs = require('./breadcrumbs');
var Dashboard = require('./pages/dashboard');
var PAGE_DICTIONARY = require('./constants/page-dictionary');

var Page = React.createClass({
  render: function(){
    return(
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            {this.props.title}
          </h1>
          <Breadcrumbs path={this.props.path}/>
        </section>
        {this.props.element}
      </div>
    );
  }
});

function mapStateToProps(state){
  var page = PAGE_DICTIONARY[state.page.name];
  return {
    title: page.title,
    path: page.path,
    element: page.element(state.page.properties)
  };
}

var PageContainer = ReactRedux.connect(mapStateToProps)(Page);

module.exports = PageContainer;
