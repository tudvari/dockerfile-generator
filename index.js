const path = require('path')

const readline = require('readline')

const Generator = require(path.resolve(__dirname + '/lib/generator'))

module.exports.generate = function (input) {
	return new Promise( function (resolve, reject) {
		try {
			resolve(Generator.generateDockerFile(input))
		}
		catch(error) {
			reject(error)
		}
	})
}

module.exports.convertToJSON = function (dockerFileStream) {
	return new Promise( function (resolve, reject) {
		let dockerJSON = {}
		let lineReader = readline.createInterface({
			input: dockerFileStream
		})

		lineReader.on('line', function (line) {

			// processing from
			if (line.startsWith('FROM')) {
				let imageName = line.substring(line.indexOf(' ') + 1, line.indexOf(':'))
				let imageVersion = line.substring(line.indexOf(':') + 1)

				dockerJSON.imagename = imageName
				dockerJSON.imageversion = imageVersion
			}

			// processing copy
			if (line.startsWith('COPY')) {
				let src = line.substring(line.indexOf(' ') + 1, line.lastIndexOf(' '))
				let dst = line.substring(line.lastIndexOf(' ') + 1)
				let copyObject = {}
				let copyArray = []

				copyObject.src = src
				copyObject.dst = dst

				if (dockerJSON.copy) {
					copyArray = dockerJSON.copy
				}
				copyArray.push(copyObject)
				dockerJSON.copy = copyArray
			}
			// processing workdir
			if (line.startsWith('WORKDIR')) {
				let workDir = line.substring(line.indexOf(' ') + 1)
				dockerJSON.workdir = workDir
			}
			// processing run commands
			if (line.startsWith('RUN')) {
				let runObject = {}
				let runArray = []
				let runArgsArray = line.split(' ')

				runArgsArray = JSON.parse(runArgsArray[1])
				runObject.command = runArgsArray[0]

				if (runArgsArray.slice(1).length) {
					runObject.args = runArgsArray.slice(1)
				}

				if (dockerJSON.run) {
					runArray = dockerJSON.run
				}

				runArray.push(runObject)
				dockerJSON.run = runArray
			}
			// processing env
			if (line.startsWith('ENV')) {

				let envName = line.substring(line.indexOf(' ') + 1, line.indexOf('='))
				let envValue = line.substring(line.indexOf('=') + 1)
				let envObject = {}
				let envArray = []

				envObject.envname = envName
				envObject.envvalue = envValue

				if (dockerJSON.env) {
					envArray = dockerJSON.env
				}

				envArray.push(envObject)
				dockerJSON.env = envArray
			}
			// processing expose
			if (line.startsWith('EXPOSE')) {
				let portNum = Number(line.substring(line.indexOf(' ') + 1))
				let portArray = []

				if (dockerJSON.expose) {
					portArray = dockerJSON.expose
				}

				portArray.push(portNum)
				dockerJSON.expose = portArray
			}
			// processing cmd
			if (line.startsWith('CMD')) {
				let cmdObject = {}
				let cmdArgsArray = line.split(' ')

				cmdArgsArray = JSON.parse(cmdArgsArray[1])

				cmdObject.command = cmdArgsArray[0]

				if (cmdArgsArray.slice(1).length) {
					cmdObject.args = cmdArgsArray.slice(1)
				}
				dockerJSON.cmd = cmdObject
			}
		})
		lineReader.on('close', function () {
			resolve(dockerJSON)
		})
	})
	
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
