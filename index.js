const DockerGenerator = require('./lib/dockerGenerator');
const JsonGenerator = require('./lib/jsonGenerator');

module.exports.generate = (input) => new Promise(((resolve, reject) => {
  try {
    resolve(DockerGenerator.generateDockerFile(input));
  } catch (error) {
    reject(error);
  }
}));

module.exports.convertToJSON = (dockerFileStream) => JsonGenerator.generateJSON(dockerFileStream);

module.exports.generateIgnoreFile = (ignoredFilesArray) => new Promise(((resolve) => {
  let ignoredFileContent = '';

  ignoredFilesArray.forEach((ignoredFile) => {
    ignoredFileContent = `${ignoredFileContent + ignoredFile}\n`;
  });

  return resolve(ignoredFileContent);
}));
