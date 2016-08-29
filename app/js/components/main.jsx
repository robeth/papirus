var React = require('react');
var ReactRedux = require('react-redux');
var Content = require('./content');
var Sidebar = require('./sidebar');
var Header = require('./header');
var PageContainer = require('./page-container');
var classnames = require('classnames');

var BinaMandiri = React.createClass({
  render: function(){
    return (
      <div className={classnames(
          'skin-blue',
          'sidebar-mini',
          {'sidebar-collapse': this.props.isSidebarCollapse})
        }
      >
        <div className="wrapper">
          <Header/>
          <Sidebar/>
          <PageContainer/>
        </div>
      </div>
    );
  }
});

function mapStateToProps(state, ownProps){
  return {
    isSidebarCollapse: state.page.isSidebarCollapse
  };
}

var BinaMandiriContainer = ReactRedux.connect(mapStateToProps)(BinaMandiri);

module.exports = BinaMandiriContainer;
