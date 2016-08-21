var React = require('react');
var Box = require('../box.jsx');
var VendorForm = require('../forms/vendor');

var VendorFormPage = React.createClass({
  render: function(){
    return (
      <section className="content">
        <Box.Container className="box-info">
          <Box.Header showBorder={true} title='Vendor Baru'/>
          <Box.Body>
            <VendorForm mode='add'/>
          </Box.Body>
        </Box.Container>
      </section>
    );
  }
});

module.exports = VendorFormPage;
