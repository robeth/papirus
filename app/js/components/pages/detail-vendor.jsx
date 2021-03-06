var React = require('react');
var Box = require('../box.jsx');
var VendorForm = require('../forms/vendor');

var VendorDetailPage = React.createClass({
  propTypes: {
    instanceId: React.PropTypes.number.isRequired
  },
  render: function(){
    /**
    * TODO Add Sale history for a vendor
    * TODO Add Sale deposit summary for a vendor
    */
    return (
      <section className="content">
        <Box.Container className="box-info">
          <Box.Header showBorder={true} title='Vendor Baru'/>
          <Box.Body>
            <VendorForm mode='edit' instanceId={this.props.instanceId}/>
          </Box.Body>
        </Box.Container>
      </section>
    );
  }
});

module.exports = VendorDetailPage;
