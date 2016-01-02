var dictionary = {};

function register(functionName, func, thisObject){
  dictionary[functionName] = {
    functionObject: func,
    thisObject: thisObject
  };
}

function call(functionName, arguments){
  console.log(functionName);
  console.log(dictionary);
  var func = dictionary[functionName].functionObject;
  var thisObject = dictionary[functionName].thisObject;

  return func.apply(thisObject, arguments);
}

module.exports = {
  register: register,
  call: call
}
