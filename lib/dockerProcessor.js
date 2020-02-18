
function processString(cmdName, param) {
  return `${cmdName} ${param}`;
}

function processCmdAndRunAndEntryPointAndShell(cmdName, params) {
  if (typeof params === 'string') {
    return `${cmdName} [ "${params}" ]`;
  }
  if (Array.isArray(params)) {
    let paramsList = '';

    for (let param of params) {
      paramsList += `"${param}", `;
    }
    // remove tailing colon
    paramsList = paramsList.replace(/, $/, '');
    return `${cmdName} [ ${paramsList} ]`;
  }
}

function processLabelAndEnv(cmdName, params) {
  let lines = '';
  if (Array.isArray(params)) {
    Object.keys(params).forEach(function (key) {
      lines += `${cmdName} ${key}=${params[key]}`;
      lines += '\n';
    });
  } else if (typeof params === 'object') {
    for (let key in params) {
      lines += `${cmdName} ${key}=${params[key]}`;
      lines += '\n';
    }
  }
  lines = lines.substring(0, lines.length - 1);
  return lines;
}

function processAddAndCopy(cmdName, params) {
  let lines = '';

  Object.keys(params).forEach(function (key) {
    lines += `${cmdName} ${key} ${params[key]}`;
    lines += '\n';
  });
  lines = lines.substring(0, lines.length - 1);
  return lines;
}

// ARG, EXPOSE
function processSimpleArrays(cmdName, params) {
  let lines = '';

  for(let param of params) {
    lines += `${cmdName} ${param}`;
    lines += '\n';
  }
  lines = lines.substring(0, lines.length - 1);
  return lines;
}

function processSingleCmd(params) {
  return processCmdAndRunAndEntryPointAndShell('CMD', params);
}

function processSingleRun(params) {
  return processCmdAndRunAndEntryPointAndShell('RUN', params);
}

function processLabels(params) {
  return processLabelAndEnv('LABEL', params);
}

function processEnvs(params) {
  return processLabelAndEnv('ENV', params);
}

function processAdd(params) {
  return processAddAndCopy('ADD', params);
}

function processCopy(params) {
  return processAddAndCopy('COPY', params);
}

function processEntryPoint(params) {
  return processCmdAndRunAndEntryPointAndShell('ENTRYPOINT', params);
}

function processFrom(param) {
  let response = processString('FROM', param.baseImage);

  if (param.alias) {
    response = `${response} AS ${param.alias}`;
  }

  return response;
}

function processUser(param) {
  return processString('USER', param);
}

function processWorkDir(param) {
  return processString('WORKDIR', param);
}

function processStopSignal(param) {
  return processString('STOPSIGNAL', param);
}

function processExposes(params) {
  return processSimpleArrays('EXPOSE', params);
}
function processArgs(params) {
  return processSimpleArrays('ARG', params);
}

function processVolumes(params) {
  return processSimpleArrays('VOLUME', params);
}

function processShell(params) {
  return processCmdAndRunAndEntryPointAndShell('SHELL', params);
}

function processComment(param) {
  return `# ${param}`;
}

function determineFunction(functionName) {
  let fName = functionName.toLowerCase();

  if (functionName.indexOf('-') !== -1) {
    fName = functionName.substring(0, functionName.indexOf('-'));
  }

  const functions = {
    from: processFrom,
    run: processSingleRun,
    cmd: processSingleCmd,
    labels: processLabels,
    expose: processExposes,
    env: processEnvs,
    add: processAdd,
    copy: processCopy,
    entrypoint: processEntryPoint,
    volumes: processVolumes,
    user: processUser,
    working_dir: processWorkDir,
    args: processArgs,
    stopsignal: processStopSignal,
    shell: processShell,
    comment: processComment,
  };

  return functions[fName] || functions.comment;
}

module.exports = {
  processFrom: processFrom,
  processRun: processSingleRun,
  processCmd: processSingleCmd,
  processLabels: processLabels,
  processEnvs: processEnvs,
  processExposes: processExposes,
  processAdd: processAdd,
  processCopy: processCopy,
  processEntryPoint: processEntryPoint,
  processUser: processUser,
  processWorkDir: processWorkDir,
  processStopSignal: processStopSignal,
  processArgs: processArgs,
  processVolumes: processVolumes,
  processShell: processShell,
  determineFunction: determineFunction,
  processComment: processComment,
}
