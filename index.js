const DockerGenerator = require('./lib/dockerGenerator')
const JsonGenerator = require('./lib/jsonGenerator')

module.exports.generate = (input) => { return new Promise((resolve, reject) => {
	try {
		resolve(DockerGenerator.generateDockerFile(input))
	} catch (error) {
		reject(error)
	}
}) }

module.exports.convertToJSON = (dockerFileStream) => { return JsonGenerator.generateJSON(dockerFileStream) }

module.exports.generateIgnoreFile = (ignoredFilesArray) => { return new Promise((resolve) => {
	let ignoredFileContent = ''

	ignoredFilesArray.forEach((ignoredFile) => {
		ignoredFileContent = `${ignoredFileContent + ignoredFile}\n`
	})

	return resolve(ignoredFileContent)
}) }
