'use strict'

var readline = require('readline')

module.exports.generate = function (input) {
	return new Promise(function (resolve, reject) {
		let incomingJSON
		let result = ''

		try {
			incomingJSON = JSON.parse(input)
		} catch (err) {
			reject(err)
		}

		// processing imageName and imageVersion
		if (!incomingJSON['imagename'] || !incomingJSON['imageversion']) {
			reject(new Error('Input JSON has a semantic error! (imagename or imageversion)'))
		} else {
			result = 'FROM ' + incomingJSON['imagename'] + ':' + incomingJSON['imageversion'] + '\n'
		}

		// processing copy commands
		if (incomingJSON['copy'] && !Array.isArray(incomingJSON['copy'])) {
			reject(new Error('Input JSON has a semantic error! (copy)'))
		} else if (incomingJSON['copy']) {

			let cpyArray = incomingJSON['copy']

			for (let cpyArrayElement of cpyArray) {
				result = result + 'COPY ' + cpyArrayElement.src + ' ' + cpyArrayElement.dst + '\n'
			}
		}

		// processing working directory
		if (incomingJSON['workdir']) {
			result = result + 'WORKDIR ' + incomingJSON['workdir'] + '\n'
		}

		// processing run commands
		if (incomingJSON['run'] && !Array.isArray(incomingJSON['run'])) {
			reject(new Error('Input JSON has a semantic error! (run)'))
		} else if (incomingJSON['run']) {

			let runArray = incomingJSON['run']
			for (let runArrayElement of runArray) {
				result = result + 'RUN [\"' + runArrayElement.command

				let args = runArrayElement.args

				if (!args) {
					result = result + '"]\n'
				} else {
					result = result + '",'

					for (let argItem of args) {
						result = result + '"' + argItem + '"'
						result = result + ','
					}
					result = result.slice(0, -1)
					result = result + ']\n'
				}
			}
		}
		// processing env commands
		if (incomingJSON['env'] && !Array.isArray(incomingJSON['env'])) {
			reject(new Error('Input JSON has a semantic error! (env)'))
		} else if (incomingJSON['env']) {

			let envArray = incomingJSON['env']
			for (let envArrayElement of envArray) {
				result = result + 'ENV ' + envArrayElement.envname + '=' + envArrayElement.envvalue + '\n'
			}
		}

		// processing expose
		if (incomingJSON['expose'] && !Array.isArray(incomingJSON['expose'])) {
			reject(new Error('Input JSON has a semantic error! (expose)'))
		} else if (incomingJSON['expose']) {
			for (let portNum of incomingJSON['expose']) {
				result = result + 'EXPOSE ' + portNum + '\n'
			}
		}
		// processing cmd
		if (!incomingJSON['cmd']) {
			reject(new Error('Input JSON has a semantic error! (cmd)'))
		} else if (!incomingJSON['cmd']['command']) {
			reject(new Error('Input JSON has a semantic error! (cmd.command)'))
		} else {
			// process command tag
			result = result + 'CMD [\"' + incomingJSON['cmd']['command']
			let args = incomingJSON['cmd']['args']
			if (!args) {
				result = result + '"]\n'
			} else {
				result = result + '",'

				for (let argItem of args) {
					result = result + '"' + argItem + '"'
					result = result + ','
				}
				result = result.slice(0, -1)
				result = result + ']\n'
			}
		}
		resolve(result)
	})
}

module.exports.convertToJSON = function (dockerFileStream, cb) {
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
		return cb(null, dockerJSON)
	})
}

module.exports.generateIgnoreFile = function (ignoredFilesArray, cb) {
	let ignoredFileContent = ''
	for (let ignoredFile of ignoredFilesArray) {
		ignoredFileContent = ignoredFileContent + ignoredFile + '\n'
	}
	return cb(null, ignoredFileContent)
}
