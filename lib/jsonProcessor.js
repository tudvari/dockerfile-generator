/**
 * Processing a single parameter
 * @param {string} inputLine - Row to be processed.
 * @param {string} overrideAttributeName - Parameter to be overriden.
 * @return {string} Generated object.
 */
function processSingeParam(inputLine, overrideAttributeName) {
  const resp = {};

  const attributeName = overrideAttributeName ||
                  inputLine.substring(0, inputLine.indexOf(' ')).toLowerCase();
  const attributeValue =
      inputLine.substring(inputLine.indexOf(' ') + 1, inputLine.length);

  resp[attributeName] = attributeValue;
  return resp;
}

/**
 * Processing an array.
 * @param {string} inputLine - Row to be processed.
 * @return {array} Generated array.
 */
function processArray(inputLine) {
  const attributeName =
      inputLine.substring(0, inputLine.indexOf(' ')).toLowerCase();
  let paramsLine =
      inputLine.substring(inputLine.indexOf(' '), inputLine.length).trim();

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

/**
 * Processing multi line parameter
 * @param {string} inputLine - Row to be processed.
 * @return {array} Generated array.
 */
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

/**
 * Processing key-value parameter
 * @param {string} inputLine - Row to be processed.
 * @return {array} Generated array.
 */
function processKeyValue(inputLine) {
  const attributeName =
      inputLine.substring(0, inputLine.indexOf(' ')).toLowerCase();
  const paramsLine =
      inputLine.substring(inputLine.indexOf(' '), inputLine.length).trim();

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

/**
 * Processing FROM keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processFROM(inputLine) {
  const response = {};
  response.from = processSingeParam(inputLine, 'baseImage');
  return response;
}

/**
 * Processing CMD keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processCMD(inputLine) {
  return processArray(inputLine);
}

/**
 * Processing RUN keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processRUN(inputLine) {
  return processArray(inputLine);
}

/**
 * Processing COPY keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processCOPY(inputLine) {
  return processMultipleParam(inputLine);
}

/**
 * Processing ADD keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processADD(inputLine) {
  return processMultipleParam(inputLine);
}

/**
 * Processing ARG keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processARG(inputLine) {
  return processSingeParam(inputLine);
}

/**
 * Processing LABEL keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processLABEL(inputLine) {
  return processKeyValue(inputLine);
}

/**
 * Processing ENV keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processENV(inputLine) {
  return processKeyValue(inputLine);
}

/**
 * Processing EXPOSE keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processEXPOSE(inputLine) {
  return processSingeParam(inputLine);
}

/**
 * Processing ENTRYPOINT keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processENTRYPOINT(inputLine) {
  return processArray(inputLine);
}

/**
 * Processing VOLUME keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processVOLUME(inputLine) {
  return processSingeParam(inputLine);
}

/**
 * Processing USER keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processUSER(inputLine) {
  return processSingeParam(inputLine);
}

/**
 * Processing WORKDIR keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processWORKDIR(inputLine) {
  return processSingeParam(inputLine);
}

/**
 * Processing STOPSIGNAL keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processSTOPSIGNAL(inputLine) {
  return processSingeParam(inputLine);
}

/**
 * Processing SHELL keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processSHELL(inputLine) {
  return processArray(inputLine);
}

/**
 * Processing COMMENT keyword.
 * @param {string} inputLine - Row to be processed.
 * @return {object} Generated object.
 */
function processCOMMENT(inputLine) {
  const resp = {};

  // Give comments a unique ID.
  const attributeName = `comment_${Math.round(Math.random() * 10000)}`;
  const attributeValue =
      inputLine.substring(inputLine.indexOf(' ') + 1, inputLine.length);

  resp[attributeName] = attributeValue;
  return resp;
}

/**
 * Determine the name of the corresponding function.
 * @param {string} inputLine - Row to be processed.
 * @return {*} - The callable function.
 */
function determineFunction(inputLine) {
  const commandName =
      inputLine.substring(0, inputLine.indexOf(' ')).toLowerCase();

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
