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
    result = 'FROM ' + incomingJSON['imagename'] + ':' + incomingJSON['imageversion']+'\n';
  }
  //processing copy commands
  if(!incomingJSON['copy'] || !Array.isArray(incomingJSON['copy'])){
    return cb(new Error('Input JSON has a semantic error! (copy)'));
  }
  else{
    let cpyArray = incomingJSON['copy'] ;
    for(let cpyArrayElement of cpyArray){
      result = result + 'COPY '+cpyArrayElement.src+' '+cpyArrayElement.dst+'\n';
    }
  }
  //processing run commands
  if(!incomingJSON['run'] || !Array.isArray(incomingJSON['run'])){
    return cb(new Error('Input JSON has a semantic error! (run)'));
  }
  else{
    let runArray = incomingJSON['run'] ;
    for(let runArrayElement of runArray){
      result = result + 'RUN [\"'+runArrayElement.command ;
      let args = runArrayElement.args ;
      if(!args.length){
        result = result +'"]\n' ;
      }
      else{
        result = result + '",' ;
        for(let argItem of args){
          result = result + '"'+argItem+'"' ;
          result = result+',' ;
        }
        result = result.slice(0,-1);
        result = result + ']\n' ;
      }
    }
  }
  return cb(null, result);
}
