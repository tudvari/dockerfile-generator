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

            // call the function
            let lineResult = callableFunction(line)

            // merge the lineResult
            let processedKeyword = Object.getOwnPropertyNames(lineResult)[0]
            let processedValue = lineResult[processedKeyword]
            
            //console.log('value: ', processedValue, !resp[processedKeyword])

            if (!resp[processedKeyword]) {
                // not exists in the response object yet.
                resp = Object.assign(resp, lineResult )

            } else if (typeof processedValue === 'string') {
                // process single element and exists in the response object already
                
                // TODO handling keyword can't have multiple value (FROM)
                
                resp = Object.assign(resp, lineResult )

            } else if (Array.isArray(processedValue)) {
                // process array and exists in the response object already
                resp[processedKeyword] = resp[processedKeyword].concat(processedValue)

            } else {
                // process key-value pairs
                resp[processedKeyword] = Object.assign(resp[processedKeyword], processedValue)
            }

        })
    
        lineReader.on('close', function() {
            resolve(resp)
        })
    })
}

module.exports.generateJSON = generateJSON