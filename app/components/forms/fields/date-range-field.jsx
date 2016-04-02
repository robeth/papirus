var React = require('react');
var DateRangePicker = require('react-bootstrap-daterangepicker');
var DEFAULT_RANGES = {
  'Today': [moment(), moment()],
  'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
};

var DateField = React.createClass({
  propTypes: {
    startDate: React.PropTypes.object,
    endDate: React.PropTypes.object,
    onEvent: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      startDate: this.props.startDate || moment().startOf('month'),
      endDate: this.props.endDate || moment().endOf('month')
    };
  },

  handleEvent: function (event, picker) {
    if(event.type !== 'apply'){
      return;
    }

    var eventData = {
      startDate: picker.startDate,
      endDate: picker.endDate
    };

    this.setState(eventData);

    if(this.props.onEvent){
      this.props.onEvent(eventData);
    }
  },

  render: function(){
    var start = this.state.startDate.format('YYYY-MM-DD');
    var end = this.state.endDate.format('YYYY-MM-DD');
    var label = start + ' - ' + end;
    if (start === end) {
      label = start;
    }

    return (
      <DateRangePicker
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        ranges={DEFAULT_RANGES}
        onEvent={this.handleEvent}>
        <button className="btn btn-default btn-block">
          <div className="pull-left"><i className="fa fa-calendar"></i></div>
          <div className="pull-right">
            <span>
              {label}
            </span>
            <span className="caret"></span>
          </div>
        </button>
      </DateRangePicker>
    );
  }
});

module.exports = DateField;
