const fs = require('fs');
const path = require('path');
const { Validator } = require('jsonschema');

const v = new Validator();

const processorPath = path.join(__dirname, '/dockerProcessor');
const dockerProcessor = require(processorPath);

const Schema = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../schema.json')));

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
  generateDockerFileFromArray: generateDockerFileFromArray,
};
