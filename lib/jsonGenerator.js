const readline = require('readline');

const jsonProcessor = require('./jsonProcessor');

function generateJSON(dockerfileStream) {
  return new Promise((resolve) => {
    const lineReader = readline.createInterface({
      input: dockerfileStream,
    });

    let resp = {};

    lineReader.on('line', (line) => {
      // determine functionality
      const callableFunction = jsonProcessor.determineFunction(line);

      // call the function
      let lineResult = callableFunction(line);

      // merge the lineResult
      let processedKeyword = Object.getOwnPropertyNames(lineResult)[0];
      let processedValue = lineResult[processedKeyword];

      // small transforms, it would be great to refactor this later.
      if (processedKeyword === 'arg' || processedKeyword === 'volume') {
        processedKeyword += 's';

        const tmpVariable = processedValue;
        processedValue = [];
        processedValue.push(tmpVariable);
      }

      if (processedKeyword === 'expose') {
        const tmpVariable = processedValue;
        processedValue = [];
        processedValue.push(tmpVariable);
      }

      if (processedKeyword === 'label') {
        processedKeyword += 's';
      }

      if (processedKeyword === 'workdir') {
        processedKeyword = 'working_dir';
      }

      const tmpObject = {};
      tmpObject[processedKeyword] = processedValue;
      lineResult = tmpObject;

      if (!resp[processedKeyword]) {
        // not exists in the response object yet.
        resp = Object.assign(resp, lineResult);
      } else if (typeof processedValue === 'string') {
        // process single element and exists in the response object already
        // TODO handling keyword can't have multiple value (FROM)
        resp = Object.assign(resp, lineResult);
      } else if (Array.isArray(processedValue)) {
        // process array and exists in the response object already
        resp[processedKeyword] = resp[processedKeyword].concat(processedValue);
      } else {
        // process key-value pairs
        resp[processedKeyword] = Object.assign(resp[processedKeyword], processedValue);
      }
    });
    lineReader.on('close', () => {
      resolve(resp);
    });
  });
}

module.exports.generateJSON = generateJSON;
