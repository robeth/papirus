module.exports={
  isForm: function(){
    return true;
  },
  getInputs: function(){
    var fields = [];

    for(var key in this.refs){
      if(this.refs[key].isField && this.refs[key].isField()){
        fields.push({
          ref: key,
          component: this.refs[key]
        });
      }
    }

    return fields;
  },
  getChildrenForms: function(){
    var childrenForms = [];

    for(var key in this.refs){
      if(this.refs[key].isForm && this.refs[key].isForm()){
        childrenForms.push({
          ref: key,
          component: this.refs[key]
        });
      }
    }

    return childrenForms;
  },
  validate: function(args){
    function validateInput(input){
      var fieldErrors = input.component.validate();
      return fieldErrors.length > 0
        ? {ref: input.key, errors: fieldErrors}
        : null;
    }
    var inputs = this.getInputs();
    var forms = this.getChildrenForms();

    var fieldValidationResult = inputs.map(validateInput);
    var formValidationResult = forms.map(validateInput);
    var additionalValidationResult = [];

    if(args && args.ignoreAdditionalValidation){
      // Don't evaluate additionalValidation
    } else if(this.additionalValidation) {
      // Additional validation implemented by form
      additionalValidationResult = this.additionalValidation();
    }

    var validationResult = fieldValidationResult
      .concat(formValidationResult)
      .concat(additionalValidationResult);

    validationResult = validationResult.filter(function(result){
      return result !== null;
    });

    return validationResult;
  },
  resetFields: function(){
    this.getInputs().map(function resetField(input){
      input.component.reset();
    });
  },
  resetChildrenForms: function(){
    this.getChildrenForms().map(function resetForm(form){
      form.component.reset();
    });
  },
  setReadOnly: function(value){
    this.setState({isReadOnly: value});
    this.getChildrenForms().map(function(childForm){
      childForm.component.setReadOnly(value);
    });
  },
  collectPayload: function(){
    var inputs = this.getInputs();
    var payload = {};

    for(var i = 0, n = inputs.length; i < n; i++){
      payload[inputs[i].ref] = inputs[i].component.value();
    }
    console.log('FormMixin-collectPayload: hehe huhu');
    console.log(payload);
    return payload;
  },
};
