
/**
 * Generate string from the params.
 * @param {string} cmdName - Name of the command.
 * @param {string} param - Parameter of the command.
 * @return {string} The generated string.
 */
function processString(cmdName, param) {
  return `${cmdName} ${param}`;
}

/**
 * Process Cmd, Run, Entrypoint, Shell commands.
 * @param {string} cmdName - Name of the command.
 * @param {*} params - Parameters of the command.
 * @return {string} - The generated string.
 */
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

/**
 * Process Label, Env commands.
 * @param {*} cmdName - Name of the command.
 * @param {*} params - Parameters of the command.
 * @return {string} - The generated string.
 */
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

/**
 * Process Arg, Expose commands.
 * @param {string} cmdName - Name of the command.
 * @param {*} params - Parameters of the command.
 * @return {string} - The generated string.
 */
function processSimpleArrays(cmdName, params) {
  let lines = '';

  params.forEach((param) => {
    lines += `${cmdName} ${param}`;
    lines += '\n';
  });

  lines = lines.substring(0, lines.length - 1);
  return lines;
}

/**
 * Process CMD command.
 * @param {*} params - parameters of the CMD command.
 * @return {string} - The generated string.
 */
function processSingleCmd(params) {
  return processCmdAndRunAndEntryPointAndShell('CMD', params);
}

/**
 * Process RUN command.
 * @param {*} params - parameters of the RUN command.
 * @return {string} - The generated string.
 */
function processSingleRun(params) {
  return processCmdAndRunAndEntryPointAndShell('RUN', params);
}

/**
 * Process LABEL command.
 * @param {*} params - parameters of the LABEL command.
 * @return {string} - The generated string.
 */
function processLabels(params) {
  return processLabelAndEnv('LABEL', params);
}

/**
 * Process ENV command.
 * @param {*} params - parameters of the ENV command.
 * @return {string} - The generated string.
 */
function processEnvs(params) {
  return processLabelAndEnv('ENV', params);
}

/**
 * Process ADD command.
 * @param {*} params - parameters of the ADD command.
 * @return {string} - The generated string.
 */
function processAdd(params) {
  let lines = '';

  Object.keys(params).forEach((key) => {
    lines += `ADD ${key} ${params[key]}`;
    lines += '\n';
  });
  lines = lines.substring(0, lines.length - 1);
  return lines;
}

/**
 * Process COPY command.
 * @param {*} params - parameters of the COPY command.
 * @return {string} - The generated string.
 */
function processCopy(params) {
  let lines = '';

  Object.keys(params).filter((key) => {
    return key !== 'from';
  }).forEach((key) => {
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

/**
 * Process ENTRYPOINT command.
 * @param {*} params - parameters of the ENTRYPOINT command.
 * @return {string} - The generated string.
 */
function processEntryPoint(params) {
  return processCmdAndRunAndEntryPointAndShell('ENTRYPOINT', params);
}

/**
 * Process FROM command.
 * @param {*} params - parameters of the FROM command.
 * @return {string} - The generated string.
 */
function processFrom(params) {
  let response = processString('FROM', params.baseImage);

  if (params.alias) {
    response = `${response} AS ${params.alias}`;
  }

  return response;
}

/**
 * Process USER command.
 * @param {*} params - parameters of the USER command.
 * @return {string} - The generated string.
 */
function processUser(params) {
  return processString('USER', params);
}

/**
 * Process WORKDIR command.
 * @param {*} params - parameters of the FROM command.
 * @return {string} - The generated string.
 */
function processWorkDir(params) {
  return processString('WORKDIR', params);
}

/**
 * Process STOPSIGNAL command.
 * @param {*} params - parameters of the STOPSIGNAL command.
 * @return {string} - The generated string.
 */
function processStopSignal(params) {
  return processString('STOPSIGNAL', params);
}

/**
 * Process EXPOSE command.
 * @param {*} params - parameters of the EXPOSE command.
 * @return {string} - The generated string.
 */
function processExposes(params) {
  return processSimpleArrays('EXPOSE', params);
}

/**
 * Process ARG command.
 * @param {*} params - parameters of the ARG command.
 * @return {string} - The generated string.
 */
function processArgs(params) {
  return processSimpleArrays('ARG', params);
}

/**
 * Process VOLUME command.
 * @param {*} params - parameters of the VOLUME command.
 * @return {string} - The generated string.
 */
function processVolumes(params) {
  return processSimpleArrays('VOLUME', params);
}
/**
 * Process SHELL command.
 * @param {*} params - parameters of the SHELL command.
 * @return {string} - The generated string.
 */
function processShell(params) {
  return processCmdAndRunAndEntryPointAndShell('SHELL', params);
}

/**
 * Process COMMENT symbol.
 * @param {*} params - parameters of the COMMENT symbol.
 * @return {string} - The generated string.
 */
function processComment(params) {
  return `# ${params}`;
}

/**
 * Determine the name of the corresponding function.
 * @param {string} functionName - Name of the function.
 * @return {*} - The callable function.
 */
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
