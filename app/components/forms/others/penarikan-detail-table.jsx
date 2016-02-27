var React = require('react');
var Alert = require('../../alert');
var classNames = require('classnames');
var InputMixin = require('../../mixins/field-mixin');
var Pembelian = window.Models.Pembelian;

var ERROR_MESSAGE = 'Jumlah lebih besar dari Pembelian Nasabah';

var PenarikanDetailTable = React.createClass({
  mixins: [InputMixin],
  propTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']).isRequired,
    nasabahId: React.PropTypes.number.isRequired,
    penarikanId: React.PropTypes.number,
    readOnly: React.PropTypes.bool,
    selectedAmount: React.PropTypes.number.isRequired
  },

  getInitialState: function(){
    console.log('PenarikanDetailTable-CWRP-field InitialState:');
    return {
      pembelianCandidates: []
    };
  },

  componentWillMount: function() {
    this.fetchCandidates();
  },

  componentWillReceiveProps: function(newProps){
    var component = this;

    // New nasabah id: update candidates & reallocate amount
    if(component.props.nasabahId != newProps.nasabahId){
      component
        .refreshCandidates(newProps.nasabahId)
        .then(function(newPembelianCandidates){
          component.allocate(
            newPembelianCandidates,
            newProps.selectedAmount
          );

          component.setState({pembelianCandidates: newPembelianCandidates})
        });
    }
    // Only selectedAmount differ: reallocate amount
    else if(component.props.selectedAmount != newProps.selectedAmount){
      component.allocate(
        component.state.pembelianCandidates,
        newProps.selectedAmount
      );
    }
  },

  fetchCandidates: function(){
    var component = this;

    component.refreshCandidates(this.props.nasabahId)
      .then(function(newPembelianCandidates){
        component.allocate(
          newPembelianCandidates,
          component.props.selectedAmount
        );

        component.setState({pembelianCandidates: newPembelianCandidates})
      });
  },

  refreshCandidates: function(nasabahId){
    var component = this;

    return Pembelian
      .getPenarikanCandidates(nasabahId)
      .then(function(pembelianCandidates){
        console.log('Penarikan-Detail-Table CWP success');
        console.log(pembelianCandidates);

        return pembelianCandidates;
      })
      .catch(function(error){
        console.log('Penarikan-Detail-Table CWP error');
        console.log(error);
      });
  },

  allocate: function(candidates, expectedAmount){
    candidates.forEach(function(candidate){
      candidate.allocatedValue = 0;
    });

    for(var i = 0; i < candidates.length; i++){
      var takenAmount = Math.min(expectedAmount, candidates[i].remainingValue);
      candidates[i].allocatedValue = takenAmount;
      expectedAmount -= takenAmount;

      // Stop when expectedAmount is satisfied
      if(expectedAmount === 0){
        break;
      }
    }
  },

  value: function(){
    console.log('PenarikanDetailTable value:');
    return this.state.pembelianCandidates.reduce(
      function(previousResult, candidate){
        if(candidate.allocatedValue > 0){
          previousResult.push(candidate);
        }

        return previousResult;
      }, []);
  },

  reset: function(){
    console.log('PenarikanDetailTable reset:');
    this.fetchCandidates();
  },

  validate: function(){
    var allocatedValue = this.state.pembelianCandidates.reduce(
      function(previousValue, candidate){
        return previousValue + parseFloat(candidate.allocatedValue);
      },
      0
    );

    var errors = allocatedValue > 0 &&
        allocatedValue === this.props.selectedAmount
      ? []
      : [ERROR_MESSAGE];

    if(errors.length > 0){
      this.refs['error-alert'].show();
    } else {
      this.refs['error-alert'].hide();
    }

    return errors;
  },

  render: function(){
    var component = this;

    var pembelianRows = component.state.pembelianCandidates.map(
      function(candidate, index){
        return (
          <tr key={index}>
            <td className="text-center">B{candidate.id}</td>
            <td className="text-center">{candidate.tanggal}</td>
            <td className="text-center">{candidate.totalValue}</td>
            <td className="text-center">{candidate.remainingValue}</td>
            <td className="text-center">{candidate.allocatedValue}</td>
          </tr>
        );
      }
    );
    return (

      <div>
        <Alert
          ref='error-alert'
          type='danger'
          title={<div><i className='icon fa fa-bug'/> Error!</div>}>
          {ERROR_MESSAGE}
        </Alert>
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th className="text-center">Pembelian</th>
              <th className="text-center">Tanggal</th>
              <th className="text-center">Total Lunas</th>
              <th className="text-center">Belum Lunas</th>
              <th className="text-center">Akan Lunas</th>
            </tr>
          </thead>
          <tbody>
            {pembelianRows}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = PenarikanDetailTable;
