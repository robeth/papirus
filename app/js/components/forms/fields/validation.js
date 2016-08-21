// Error if value:
// - is not string
// - blank string
// - is whitespace-only string
function required(value){
  if(!value){
    return "Wajib diisi";
  }

  if(typeof value !== 'string'){
    try{
      value = value.toString();
    } catch(error){
      return error.toString();
    }
  }

  return value.trim() ? null : "Wajib diisi";
}

// Error if value is not numeric
// Source: http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
function isNumber(value) {
  var result = !isNaN(parseFloat(value)) && isFinite(value);

  return result ? null : 'Bukan angka';
}

var VALIDATION_DICTIONARY = {
  required: required,
  isNumber: isNumber
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
