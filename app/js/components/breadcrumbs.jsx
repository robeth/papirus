var React = require('react');
var classNames = require('classnames');
var PageLink = require('./page-link');

var Breadcrumbs = React.createClass({
  propTypes: {
    path: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },

  render: function(){

    var links = this.props.path.map(function(linkInfo, index, array){
      var dashboardIcon = (<i className="fa fa-dashboard"/>);
      var icon = index === 0 ? dashboardIcon : '';
      var isLast = index === array.length - 1;

      return (
        <li
          key={index}
          className={classNames({'active': isLast})}>
          <PageLink to={linkInfo.to}>{icon} {linkInfo.label}</PageLink>
        </li>
      );
    });

    return (
      <ol className="breadcrumb">
        {links}
      </ol>
    );
  }
});

module.exports = Breadcrumbs;
