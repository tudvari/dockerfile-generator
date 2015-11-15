'use strict' ;

module.exports.generate = function(input, cb) {
  let incomingJSON = undefined;
  let result = '';
  try {
    incomingJSON = JSON.parse(input) ;
  } catch (err) {
    return cb(err);
  }
  //processing imageName and imageVersion
  if (!incomingJSON['imagename'] || !incomingJSON['imageversion']) {
    return cb(new Error('Input JSON has a semantic error! (imagename or imageversion)'));
  } else {
    result = 'FROM ' + incomingJSON['imagename'] + ':' + incomingJSON['imageversion'] + '\n';
  }
  //processing copy commands
  if (!incomingJSON['copy'] || !Array.isArray(incomingJSON['copy'])) {
    return cb(new Error('Input JSON has a semantic error! (copy)'));
  } else {

    let cpyArray = incomingJSON['copy'];
    for (let cpyArrayElement of cpyArray) {
      result = result + 'COPY ' + cpyArrayElement.src + ' ' + cpyArrayElement.dst + '\n';
    }
  }
  //processing run commands
  if (!incomingJSON['run'] || !Array.isArray(incomingJSON['run'])) {
    return cb(new Error('Input JSON has a semantic error! (run)'));
  } else {

    let runArray = incomingJSON['run'];
    for (let runArrayElement of runArray) {

      result = result + 'RUN [\"' + runArrayElement.command;
      let args = runArrayElement.args;

      if (!args) {
        result = result + '"]\n';
      } else {

        result = result + '",';
        for (let argItem of args) {

          result = result + '"' + argItem + '"';
          result = result + ',';
        }
        result = result.slice(0, -1);
        result = result + ']\n';
      }
    }
  }
  //processing env commands
  if (incomingJSON['env'] && !Array.isArray(incomingJSON['env'])) {
    return cb(new Error('Input JSON has a semantic error! (env)'));
  } else if (incomingJSON['env']) {
    let envArray = incomingJSON['env'];
    for (let envArrayElement of envArray) {
      result = result + 'ENV ' + envArrayElement.envname + '=' + envArrayElement.envvalue + '\n';
    }
  }
  //processing expose
  if (incomingJSON['expose'] && !Array.isArray(incomingJSON['expose'])) {
    return cb(new Error('Input JSON has a semantic error! (expose)'));
  } else if (incomingJSON['expose']) {

    for (let portNum of incomingJSON['expose']) {

      result = result + 'EXPOSE ' + portNum + '\n';
    }
  }
  //processing cmd
  if (!incomingJSON['cmd']) {
    return cb(new Error('Input JSON has a semantic error! (cmd)'));
  } else if (!incomingJSON['cmd']['command']) {
    return cb(new Error('Input JSON has a semantic error! (cmd.command)'));
  } else {
    //process command tag
    result = result + 'CMD [\"' + incomingJSON['cmd']['command'];
    let args = incomingJSON['cmd']['args'];
    if (!args) {
      result = result + '"]\n';
    } else {
      result = result + '",';
      for (let argItem of args) {
        result = result + '"' + argItem + '"';
        result = result + ',';
      }
      result = result.slice(0, -1);
      result = result + ']\n';
    }
  }
  return cb(null, result);
}
