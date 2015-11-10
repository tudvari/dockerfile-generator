'use strict' ;

module.exports.generate = function(input, cb) {
  let incomingJSON;
  let result = '';
  try {
    incomingJSON = JSON.parse(input) ;
  } catch (err) {
    return cb(err);
  }
  //processing imageName and imageVersion
  if (!incomingJSON['imagename'] || !incomingJSON['imageversion']) {
    return cb(new Error('Input JSON has a semantic error!'));
  } else {
    result = 'FROM ' + incomingJSON['imagename'] + ':' + incomingJSON['imageversion'];
  }
  return cb(null, result);
}
