'use strict' ;

const readline = require('readline');

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
  if (incomingJSON['copy'] && !Array.isArray(incomingJSON['copy'])) {
    return cb(new Error('Input JSON has a semantic error! (copy)'));
  } else if (incomingJSON['copy']) {

    let cpyArray = incomingJSON['copy'];

    for (let cpyArrayElement of cpyArray) {
      result = result + 'COPY ' + cpyArrayElement.src + ' ' + cpyArrayElement.dst + '\n';
    }
  }

  //processing working directory
  if (incomingJSON['workdir']) {
    result = result + 'WORKDIR ' + incomingJSON['workdir'] + '\n';
  }

  //processing run commands
  if (incomingJSON['run'] && !Array.isArray(incomingJSON['run'])) {
    return cb(new Error('Input JSON has a semantic error! (run)'));
  } else if (incomingJSON['run']) {

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

module.exports.convertToJSON = function(dockerFileStream, cb) {
  let dockerJSON = {};

  let lineReader = readline.createInterface({
    input: dockerFileStream
  });

  lineReader.on('line', function(line) {
    //processing from
    if (line.startsWith('FROM')) {
      let imageName = line.substring(line.indexOf(' ') + 1, line.indexOf(':'));
      let imageVersion = line.substring(line.indexOf(':') + 1);

      dockerJSON.imagename = imageName;
      dockerJSON.imageversion = imageVersion;
    }
    //processing copy
    if (line.startsWith('COPY')) {
      let src = line.substring(line.indexOf(' ') + 1, line.lastIndexOf(' '));
      let dst = line.substring(line.lastIndexOf(' ') + 1);
      let copyObject = {};

      copyObject.src = src ;
      copyObject.dst = dst ;

      let copyArray = [];

      if (dockerJSON.copy) {
        copyArray = dockerJSON.copy;
      }
      copyArray.push(copyObject) ;
      dockerJSON.copy = copyArray ;
    }
    //processing workdir
    if (line.startsWith('WORKDIR')) {
      let workDir = line.substring(line.indexOf(' ') + 1);
      dockerJSON.workdir = workDir;
    }
    //processing run commands
    if (line.startsWith('RUN')) {
      let runArgsArray = line.split(' ');
      let runCommand = runArgsArray[0];
      let runArgs = runArgsArray.splice(0, 1);
      let runObject = {};

      runObject.command = runCommand;
      runObject.args = runArgs;

      let runArray = [];

      if (dockerJSON.run) {
        runArray = dockerJSON.run;
      }

      runArray.push(runObject);
      dockerJSON.run = runArray;
    }
    //processing env

    if (line.startsWith('ENV')) {

      let envName = line.substring(line.indexOf(' ') + 1, line.indexOf('='));
      let envValue = line.substring(line.indexOf('=') + 1);
      let envObject = {};

      envObject.envname = envName;
      envObject.envvalue = envValue;

      let envArray = [];

      if (dockerJSON.env) {
        envArray = dockerJSON.env;
      }

      envArray.push(envObject);
      dockerJSON.env = envArray;
    }
    //processing expose
    if (line.startsWith('EXPOSE')) {
      let portNum = line.substring(line.indexOf(' ') + 1);
      let portArray = [];

      if (dockerJSON.expose) {
        portArray = dockerJSON.expose;
      }
      portArray.push(portNum);
      dockerJSON.expose = portArray ;
    }
  //processing cmd
  });
  lineReader.on('close', function() {
    console.log('dockerJSON is:', dockerJSON) ;
    return cb(null, dockerJSON);
  }) ;
}
