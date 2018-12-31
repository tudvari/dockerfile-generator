
function processFrom (fromValue) {
    return `FROM ${fromValue}`
}

function processSingleRun(run) {
    if (typeof run === 'string') {
        return `RUN [ "${run}" ]`
    }
    else if (Array.isArray(run)) {
        let paramsList = ''
        
        for( param of run ) {
            paramsList += `"${param}", `
        }
        // remove tailing colon
        paramsList = paramsList.replace(/, $/, '')

        return `RUN [ ${paramsList} ]` 
    }
}

function processSingleCmd(run) {
    if (typeof run === 'string') {
        return `CMD [ "${run}" ]`
    }
    else if (Array.isArray(run)) {
        let paramsList = ''
        
        for( param of run ) {
            paramsList += `"${param}", `
        }
        // remove tailing colon
        paramsList = paramsList.replace(/, $/, '')

        return `CMD [ ${paramsList} ]` 
    }
}

module.exports = {
    processFrom: processFrom,
    processRun: processSingleRun,
    processCmd: processSingleCmd
}