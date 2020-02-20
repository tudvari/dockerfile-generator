function processSingeParam(inputLine, overrideAttributeName) {
  const resp = {};

  const attributeName = overrideAttributeName || inputLine.substring(0, inputLine.indexOf(' ')).toLowerCase();
  const attributeValue = inputLine.substring(inputLine.indexOf(' ') + 1, inputLine.length);

  resp[attributeName] = attributeValue;
  return resp;
}

function processArray(inputLine) {
  const attributeName = inputLine.substring(0, inputLine.indexOf(' ')).toLowerCase();
  let paramsLine = inputLine.substring(inputLine.indexOf(' '), inputLine.length).trim();

  // remove brackets
  paramsLine = paramsLine.replace(/\[/g, '').replace(/\]/g, '');
  // remove marks
  paramsLine = paramsLine.replace(/"/g, '');
  // remove whitespaces
  paramsLine = paramsLine.replace(/ /g, '');

  const params = paramsLine.split(',');

  const resp = {};
  resp[attributeName] = params;

  return resp;
}

function processMultipleParam(inputLine) {
  const params = inputLine.split(' ');

  const attributeName = params[0].toLowerCase();

  const resp = {};

  let key;
  let value;

  // eslint-disable-next-line prefer-const
  [, key, value] = params;

  resp[key] = value;

  const globalResp = {};
  globalResp[attributeName] = resp;

  return globalResp;
}

function processKeyValue(inputLine) {
  const attributeName = inputLine.substring(0, inputLine.indexOf(' ')).toLowerCase();
  const paramsLine = inputLine.substring(inputLine.indexOf(' '), inputLine.length).trim();

  const params = paramsLine.split('=');

  const resp = {};

  let key;
  let value;

  // eslint-disable-next-line prefer-const
  [key, value] = params;
  resp[key] = value;

  const globalResp = {};
  globalResp[attributeName] = resp;

  return globalResp;
}

function processFROM(inputLine) {
  const response = {};
  response.from = processSingeParam(inputLine, 'baseImage');
  return response;
}

function processCMD(inputLine) {
  return processArray(inputLine);
}

function processRUN(inputLine) {
  return processArray(inputLine);
}

function processCOPY(inputLine) {
  return processMultipleParam(inputLine);
}

function processADD(inputLine) {
  return processMultipleParam(inputLine);
}
function processARG(inputLine) {
  return processSingeParam(inputLine);
}

function processLABEL(inputLine) {
  return processKeyValue(inputLine);
}

function processENV(inputLine) {
  return processKeyValue(inputLine);
}

function processEXPOSE(inputLine) {
  return processSingeParam(inputLine);
}

function processENTRYPOINT(inputLine) {
  return processArray(inputLine);
}

function processVOLUME(inputLine) {
  return processSingeParam(inputLine);
}

function processUSER(inputLine) {
  return processSingeParam(inputLine);
}

function processWORKDIR(inputLine) {
  return processSingeParam(inputLine);
}

function processSTOPSIGNAL(inputLine) {
  return processSingeParam(inputLine);
}

function processSHELL(inputLine) {
  return processArray(inputLine);
}

function processCOMMENT(inputLine) {
  const resp = {};

  // Give comments a unique ID.
  const attributeName = `comment_${Math.round(Math.random() * 10000)}`;
  const attributeValue = inputLine.substring(inputLine.indexOf(' ') + 1, inputLine.length);

  resp[attributeName] = attributeValue;
  return resp;
}

function determineFunction(inputLine) {
  const commandName = inputLine.substring(0, inputLine.indexOf(' ')).toLowerCase();

  const functions = {
    from: processFROM,
    cmd: processCMD,
    run: processRUN,
    copy: processCOPY,
    add: processADD,
    label: processLABEL,
    env: processENV,
    expose: processEXPOSE,
    entrypoint: processENTRYPOINT,
    volume: processVOLUME,
    user: processUSER,
    workdir: processWORKDIR,
    stopsignal: processSTOPSIGNAL,
    shell: processSHELL,
    arg: processARG,
    comment: processCOMMENT,
  };

  return functions[commandName] || functions.comment;
}

module.exports.determineFunction = determineFunction;
