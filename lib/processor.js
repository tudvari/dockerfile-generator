
function processFrom (fromValue) {
    return `FROM ${fromValue}`
}

function processCmdAndRun(cmdName, params) {
    if (typeof params === 'string') {
        return `${cmdName} [ "${params}" ]`
    }
    else if (Array.isArray(params)) {
        let paramsList = ''
        
        for( param of params ) {
            paramsList += `"${param}", `
        }
        // remove tailing colon
        paramsList = paramsList.replace(/, $/, '')

        return `${cmdName} [ ${paramsList} ]` 
    }

}

function processLabelAndEnv(cmdName, params) {
    let lines = ''
	if (Array.isArray(params)) {

        Object.keys(params).forEach( function(key) {
            lines += `${cmdName} ${key}=${params[key]}`
            lines += '\n'
        }) 
    } else if( typeof params === 'object') {
        
        for(let key in params) {
            lines += `${cmdName} ${key}=${params[key]}`
            lines += '\n'
        }
    }
    return lines
}


function processSingleCmd(params){
    return processCmdAndRun('CMD',params)
} 

function processSingleRun(params){
    return processCmdAndRun('RUN',params)
}

function processLabels(params) {
    return processLabelAndEnv('LABEL', params)
}

function processEnvs(params) {
    return processLabelAndEnv('ENV', params) 
}

module.exports = {
    processFrom: processFrom,
    processRun: processSingleRun,
    processCmd: processSingleCmd,
    processLabels: processLabels,
    processEnvs: processEnvs
}
