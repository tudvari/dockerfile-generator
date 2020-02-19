
function processString(cmdName, param) {
  return `${cmdName} ${param}`;
}

function processCmdAndRunAndEntryPointAndShell(cmdName, params) {
  if (typeof params === 'string') {
    return `${cmdName} [ "${params}" ]`;
  }
  if (Array.isArray(params)) {
    let paramsList = '';

    params.forEach((param) => {
      paramsList += `"${param}", `;
    });

    // remove tailing colon
    paramsList = paramsList.replace(/, $/, '');
    return `${cmdName} [ ${paramsList} ]`;
  }
  return null;
}

function processLabelAndEnv(cmdName, params) {
  let lines = '';
  if (Array.isArray(params)) {
    Object.keys(params).forEach((key) => {
      lines += `${cmdName} ${key}=${params[key]}`;
      lines += '\n';
    });
  } else if (typeof params === 'object') {
    Object.keys(params).forEach((key) => {
      lines += `${cmdName} ${key}=${params[key]}`;
      lines += '\n';
    });
  }
  lines = lines.substring(0, lines.length - 1);
  return lines;
}

// ARG, EXPOSE
function processSimpleArrays(cmdName, params) {
  let lines = '';

  params.forEach((param) => {
    lines += `${cmdName} ${param}`;
    lines += '\n';
  });

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
  let lines = '';

  Object.keys(params).forEach((key) => {
    lines += `ADD ${key} ${params[key]}`;
    lines += '\n';
  });
  lines = lines.substring(0, lines.length - 1);
  return lines;
}

function processCopy(params) {
  let lines = '';

  Object.keys(params).filter((key) => key !== 'from').forEach((key) => {
    let command = 'COPY';

    if (params.from) {
      command = `COPY --from=${params.from}`;
    }

    lines += `${command} ${key} ${params[key]}`;
    lines += '\n';
  });
  lines = lines.substring(0, lines.length - 1);
  return lines;
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
  processFrom,
  processRun: processSingleRun,
  processCmd: processSingleCmd,
  processLabels,
  processEnvs,
  processExposes,
  processAdd,
  processCopy,
  processEntryPoint,
  processUser,
  processWorkDir,
  processStopSignal,
  processArgs,
  processVolumes,
  processShell,
  determineFunction,
  processComment,
};
