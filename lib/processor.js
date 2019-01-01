
function processString (cmdName, param) {
    return `${cmdName} ${param}`
}

function processCmdAndRunAndEntryPoint(cmdName, params) {
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

function processAddAndCopy(cmdName, params) {
    let lines = ''
	
    Object.keys(params).forEach( function(key) {
        lines += `${cmdName} ${key} ${params[key]}`
        lines += '\n'
    }) 
    
    return lines
}

// ARG, EXPOSE
function processSimpleArrays(cmdName, params) {
    let lines = ''

    for(let param of params) {
        lines += `${cmdName} ${param}`
        lines += '\n'
    }
    return lines
}

function processSingleCmd(params){
    return processCmdAndRunAndEntryPoint('CMD',params)
} 

function processSingleRun(params){
    return processCmdAndRunAndEntryPoint('RUN',params)
}

function processLabels(params) {
    return processLabelAndEnv('LABEL', params)
}

function processEnvs(params) {
    return processLabelAndEnv('ENV', params) 
}

function processAnd(params) {
    return processAddAndCopy('ADD', params)
}

function processCopy(params) {
    return processAddAndCopy('COPY', params)
}

function processEntryPoint(params) {
    return processCmdAndRunAndEntryPoint('ENTRYPOINT', params)
}

function processFrom(param) {
    return processString('FROM', param)
}

function processUser(param) {
    return processString('USER', param)
}

function processWorkDir(param) {
    return processString('WORKDIR', param)
}

function processStopSignal(param){
    return processString('STOPSIGNAL', param)
}

function processExposes(params) {
    return processSimpleArrays('EXPOSE', params)
}
function processArgs(params) {
    return processSimpleArrays('ARG', params)
}

module.exports = {
    processFrom: processFrom,
    processRun: processSingleRun,
    processCmd: processSingleCmd,
    processLabels: processLabels,
    processEnvs: processEnvs,
    processExposes: processExposes,
    processAnd: processAnd,
    processCopy: processCopy,
    processEntryPoint: processEntryPoint,
    processUser: processUser,
    processWorkDir: processWorkDir,
    processStopSignal: processStopSignal,
    processArgs: processArgs
}
