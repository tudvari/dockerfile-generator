
function processSingeParam(inputLine) {
    let resp = {};

    let attributeName = inputLine.substring(0, inputLine.indexOf(' ')).toLowerCase();
    let attributeValue = inputLine.substring(inputLine.indexOf(' ') + 1, inputLine.length )

    resp[attributeName] = attributeValue
    return resp 
}

function processArray(inputLine) {
    let attributeName = inputLine.substring(0, inputLine.indexOf(' ')).toLowerCase()
    let paramsLine = inputLine.substring(inputLine.indexOf(' ') , inputLine.length ).trim()
    
    // remove brackets
    paramsLine = paramsLine.replace(/\[/g,"").replace(/\]/g,"")
    // remove marks
    paramsLine = paramsLine.replace(/\"/g,"")
    // remove whitespaces
    paramsLine = paramsLine.replace(/\ /g,"")
    //paramsLine = paramsLine.replace(/^\s+|\s+$/g,'')
    //paramsLine.trim()

    let params = paramsLine.split(",")

    let resp = {}
    resp[attributeName] = params

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

function processKeyValue(inputLine) {
    let attributeName = inputLine.substring(0, inputLine.indexOf(' ')).toLowerCase()
    let paramsLine = inputLine.substring(inputLine.indexOf(' ') , inputLine.length ).trim()

    let params = paramsLine.split("=")

    let resp = {}
    resp[params[0]] = params[1]

    let globalResp = {}
    globalResp[attributeName] = resp 

    return globalResp
}

function processFROM(inputLine) {
    return processSingeParam(inputLine)
}

function processCMD(inputLine) {
    return processArray(inputLine)
}

function processRUN(inputLine) {
    return processArray(inputLine)
}

function processCOPY(inputLine) {
    return processMultipleParam(inputLine)
}

function processADD(inputLine) {
    return processMultipleParam(inputLine)
}
function processARG(inputLine) {
    return processSingeParam(inputLine)
}

function processLABEL(inputLine) {
    return processKeyValue(inputLine)
}

function processENV(inputLine) {
    return processKeyValue(inputLine)
}

function processEXPOSE(inputLine) {
    return processSingeParam(inputLine)
}

function processENTRYPOINT(inputLine) {
    return processArray(inputLine)
}

function processVOLUME(inputLine) {
    return processSingeParam(inputLine)
}

function processUSER(inputLine) {
    return processSingeParam(inputLine)
}

function processWORKDIR(inputLine) {
    return processSingeParam(inputLine)
}

function processSTOPSIGNAL(inputLine) {
    return processSingeParam(inputLine)
}

function processSHELL(inputLine) {
    return processArray(inputLine)
}

function processCOMMENT(inputLine) {
    let resp = {}
    // Give comments a unique ID.
    let attributeName = "comment_" + Math.round(Math.random() * 10000)
    let attributeValue = inputLine.substring(inputLine.indexOf(' ') + 1, inputLine.length )

    resp[attributeName] = attributeValue
    return resp
}

function determineFunction (inputLine) {
    let commandName = inputLine.substring(0,inputLine.indexOf(' ')).toLowerCase()

    let functions = {
        from: processFROM,
        cmd: processCMD,
        run: processRUN,
        copy: processCOPY,
        add: processADD,
        label: processLABEL,
        env: processENV,
        expose: processEXPOSE,
        entrypoint: processENTRYPOINT,
        volume: processVOLUME,
        user: processUSER,
        workdir: processWORKDIR,
        stopsignal: processSTOPSIGNAL,
        shell: processSHELL,
        arg: processARG,
        comment: processCOMMENT
    }

    return functions[commandName] || functions["comment"]
}

module.exports.determineFunction = determineFunction
