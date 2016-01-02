// Error if value:
// - is not string
// - blank string
// - is whitespace-only string
function required(value){
  if(!value){
    return "This field is required";
  }

  if(typeof value !== 'string'){
    try{
      value = value.toString();
    } catch(error){
      return error.toString();
    }
  }

  return value.trim() ? null : "This field is required";
}

var VALIDATION_DICTIONARY = {
  required: required
}

function check(validationFunctionNames, value){
  var validationResult = [];
  for(var i = 0; i < validationFunctionNames.length; i++){
    var functionName = validationFunctionNames[i];
    var validationFunction = VALIDATION_DICTIONARY[functionName];

    if(validationFunction){
      var result = validationFunction(value);
      if(result){
        validationResult.push(result);
      }
    }
  }
  return validationResult;
}

module.exports = {
  check: check
};
