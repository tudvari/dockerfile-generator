const {Validator} = require('jsonschema');
const v = new Validator();
const dockerProcessor = require('./dockerProcessor');
const Schema = require('../schema.json');

/**
 * Generate Dockerfile from JSON.
 * @param {string} inputJSON - The JSON representation of the Dockerfile.
 * @return {string} The generated Dockerfile.
 */
function generateDockerFileFromJSON(inputJSON) {
  const validationResult = v.validate(inputJSON, Schema);

  if (validationResult.errors.length !== 0) {
    throw Error('Input Validation error');
  }

  let resp = '';
  Object.keys(inputJSON).forEach((key) => {
    const callableFunction = dockerProcessor.determineFunction(key);
    resp += callableFunction(inputJSON[key]);
    resp += '\n';
  });

  return resp;
}
/**
 * Generate Dockerfile from an Array.
 * @param {Array} inputArray - Array representation of the Dockerfile.
 * @return {string}The generated Dockerfile.
 */
function generateDockerFileFromArray(inputArray) {
  let resp = '';
  inputArray.forEach((item) => {
    Object.keys(item).forEach((key) => {
      const callableFunction = dockerProcessor.determineFunction(key);
      resp += callableFunction(item[key]);
      resp += '\n';
    });
  });
  return resp;
}

module.exports = {
  generateDockerFile: generateDockerFileFromJSON,
  generateDockerFileFromArray,
};
