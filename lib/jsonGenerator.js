const readline = require('readline')
const path = require('path')

const jsonProcessor = require(path.resolve(__dirname, './jsonProcessor'))

function generateJSON(dockerfileStream) {
    return new Promise((resolve, reject) => {
        let lineReader = readline.createInterface({
            input: dockerfileStream
        })
    
        let resp = {}
    
        lineReader.on('line', (line) => {
            // determine functionality
            let callableFunction = jsonProcessor.determineFunction(line)
            resp = callableFunction(line)
        })
    
        lineReader.on('close', function() {
            resolve(resp)
        })
    })
}

module.exports.generateJSON = generateJSON