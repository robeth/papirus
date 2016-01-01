var React = require('react');

var DynamicForm = React.createClass({
  getPropTypes: {
    refLabel: React.PropTypes.string
  },

  getInitialState: function(){
    return {
      childrenIds:[0],
      lastIndex: 0
    }
  },

  removeRow: function(childId){
    var component = this;
    return function(event){
      event.preventDefault();
      console.log('remove child id:' + childId);
      var childrenIds = component.state.childrenIds;
      var childIndex = childrenIds.indexOf(childId);
      if(childId !== -1){
        childrenIds.splice(childIndex, 1);
      }
      component.setState({
        childrenIds: childrenIds
      });
    };
  },

  addRow: function(event){
    event.preventDefault();
    var newLastIndex = this.state.lastIndex + 1;
    this.state.childrenIds.push(newLastIndex);

    this.setState({
      lastIndex: newLastIndex
    });
  },

  validate: function(){
    function validateForm(form){
      var fieldErrors = form.component.validate();
      return fieldErrors.length > 0
        ? {ref: form.key, errors: fieldErrors}
        : null;
    }

    return this.mapFormRefs(validateForm);
  },

  mapFormRefs: function(mappedFunction){
    var forms = [];
    var results = [];

    for(var key in this.refs){
      if(this.refs[key].validate){
        forms.push({component: this.refs[key], key: key});
      }
    }

    console.log('dynamic form all refs:');
    console.log(this.refs)
    console.log('dynamic form form refs: ');
    console.log(forms);

    for(var i = 0; i < forms.length; i++){
      if(forms[i].component.validate){
        var result = mappedFunction(forms[i]);
        console.log('validation form-'+i);
        console.log(result);
        if(result){
          results.push(result);
        }
      }
    }

    return results;
  },

  save: function(args){
    this.getChildrenForms().map(function(childForm, index, arr){
      childForm.save(args);
    });
  },

  getChildrenForms: function(){
    var childrenForms = [];

    for(var key in this.refs){
      if(this.refs[key].save){
        childrenForms.push(this.refs[key]);
      }
    }
    console.log('result forms:')
    console.log(childrenForms);

    return childrenForms;
  },

  generateRef: function(index){
    return (this.props.refLabel || 'dynamic-form-') + index;
  },

  render: function(){
    var component = this;
    var rows = component.state.childrenIds.map(function(childId, index, arr){
      return component.props.element({
        onRemoveClick: component.removeRow(childId),
        key: childId,
        ref: component.generateRef(childId)
      });
    });

    return (
      <div>
        {component.props.header()}
        {rows}
        <div className='row'>
          <div className="col-xs-12">
            <button className="btn btn-block btn-default btn-sm"
              onClick={this.addRow}>
              <i className='fa fa-plus'/> Tambah
            </button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DynamicForm;
