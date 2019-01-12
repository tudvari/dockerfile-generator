
function processSingeParam(inputLine) {
    let resp = {}

    let attributeName = inputLine.substring(0, inputLine.indexOf(' '))
    let attributeValue = inputLine.substring(inputLine.indexOf(' ') + 1, inputLine.length )

    resp[attributeName.toLowerCase()] = attributeValue
    return resp 
}

function processArray(inputLine) {
    let attributeName = inputLine.substring(0, inputLine.indexOf(' '))
    let paramsLine = inputLine.substring(inputLine.indexOf(' ') , inputLine.length ).trim()
    
    // remove brackets
    paramsLine = paramsLine.replace(/\[/g,"").replace(/\]/g,"")
    // remove marks
    paramsLine = paramsLine.replace(/\"/g,"")
    
    let params = paramsLine.split(",")

    let resp = {}

    resp[attributeName.toLowerCase()] = params

    return resp
}

function processMultipleParam(inputLine) {
    let params = inputLine.split(" ")

    let attributeName = params[0].toLowerCase()

    let resp = {}
    resp[params[1]] = params[2]

    let globalResp = {}
    globalResp[attributeName] = resp 

    return globalResp
}

function processFROM(inputLine) {
    return processSingeParam(inputLine)
}

function processCMD(inputLine){
    return processArray(inputLine)
}

function processCOPY(inputLine){
    return processMultipleParam(inputLine)
}

function determineFunction (inputLine) {
    let commandName = inputLine.substring(0,inputLine.indexOf(' '))

    let functions = {
        from: processFROM,
        cmd: processCMD,
        copy: processCOPY

    }
    return functions[commandName.toLowerCase()]
}

module.exports.determineFunction = determineFunction