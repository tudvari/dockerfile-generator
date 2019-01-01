
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

function processSingleCmd(params){
	return processCmdAndRun('CMD',params)
}

function processSingleRun(params){
	return processCmdAndRun('RUN',params)
}



module.exports = {
    processFrom: processFrom,
    processRun: processSingleRun,
    processCmd: processSingleCmd
}
