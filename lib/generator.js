const fs = require('fs')
const path = require('path')

const Validator = require('jsonschema').Validator
const v = new Validator()

const Processor = require(path.resolve(__dirname + '/processor'))
const Schema = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../schema.json')))

function generateDockerFile(inputJSON) {
    let validationResult = v.validate(Schema, inputJSON)

    if (!validationResult.valid) {
        throw Error('Input Validation error')
    }

    let resp = ''

    Object.keys(inputJSON).forEach(function(key) {
        let callableFunction = Processor.determineFunction(key)
        resp += callableFunction(inputJSON[key])
        resp += '\n'
    })

    return resp ;
}

module.exports.generateDockerFile = generateDockerFile