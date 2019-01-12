const path = require('path')

const DockerGenerator = require(path.resolve(__dirname + '/lib/dockerGenerator'))

module.exports.generate = function (input) {
	return new Promise( function (resolve, reject) {
		try {
			resolve(DockerGenerator.generateDockerFile(input))
		}
		catch(error) {
			reject(error)
		}
	})
}

module.exports.convertToJSON = function (dockerFileStream) {
	return DockerGenerator.generateJSON(dockerFileStream)
}

module.exports.generateIgnoreFile = function (ignoredFilesArray) {
	return new Promise( function (resolve, reject) {
		let ignoredFileContent = ''
		for (let ignoredFile of ignoredFilesArray) {
			ignoredFileContent = ignoredFileContent + ignoredFile + '\n'
		}
		return resolve(ignoredFileContent)
	})

}
