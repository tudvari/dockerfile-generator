# dockerfile-generator

Generating Dockerfile from JSON and generate JSON document from a Dockerfile.

[![Build Status](https://travis-ci.org/tudvari/dockerfile-generator.svg?branch=master)](https://travis-ci.org/tudvari/dockerfile-generator)
[![Code Climate](https://codeclimate.com/github/tudvari/dockerfile-generator/badges/gpa.svg)](https://codeclimate.com/github/tudvari/dockerfile-generator)
[![Test Coverage](https://codeclimate.com/github/tudvari/dockerfile-generator/badges/coverage.svg)](https://codeclimate.com/github/tudvari/dockerfile-generator/coverage)
[![npm version](https://badge.fury.io/js/dockerfile-generator.svg)](https://badge.fury.io/js/dockerfile-generator)

## About the package

The main goal of this package is to support a Dockfile generation from Javascript. You are able to use all keyword from a Dockerfile reference.

Dockerfile reference is [HERE](https://docs.docker.com/engine/reference/builder/).

###  Changes of the Latest Release

#### Version 3.1.1 (2019.02.18)

- linting, gulp support

You can find all Release Notes [HERE](https://github.com/tudvari/dockerfile-generator/blob/master/ReleaseNotes.md).

## Usage

```Javascript
var generator = require('dockerfile-generator')

let result = await generator.generate(inputJSON)
// Result is a generated Dockerfile.

let convertedJSON = generator.convertToJSON(inputDockerFile)
// Result is a generated JSON from Dockerfile.

let genereratedIgnore = await generator.generateIgnoreFile(ignoredElementsArray)
// generatedIgnore is a generated dockerignore file
```

### Examples

#### Example for Dockerfile Generation ( generate function )

##### Input

```code
    {
      from: "nginx:latest",
      run: [ "adduser", "--disabled-password", "-gecos", "", "testuser" ],
      volumes: [ "/home/testuser/app" ],
      user: "testuser",
      working_dir: "/home/testuser/app",
      labels: {
        name: "value"
      },
      env: {
        env1: "value1",
        env2: "value2"
      },
      add: {
        'test.run' : '/home/testuser/app/test.run'
      },
      copy:  {
        'test.cmd' : '/home/testuser/app/test.cmd'
      },
      entrypoint: "tail",
      cmd: ["-f", "/dev/null"],
      expose: ["80/tcp"],
      args: [ "value1", "value2"],
      stopsignal: "stop",
      shell: [ "/bin/bash", "-c", "echo", "hello" ]
    }
```
##### Output

```code
FROM nginx:latest
RUN [ "adduser", "--disabled-password", "-gecos", "", "testuser" ]
VOLUME /home/testuser/app
USER testuser
WORKDIR /home/testuser/app
LABEL name=value
ENV env1=value1
ENV env2=value2
ADD test.run /home/testuser/app/test.run
COPY test.cmd /home/testuser/app/test.cmd
ENTRYPOINT [ "tail" ]
CMD [ "-f", "/dev/null" ]
EXPOSE 80/tcp
ARG value1
ARG value2
STOPSIGNAL stop
SHELL [ "/bin/bash", "-c", "echo", "hello"]
```
#### Example for JSON Generation ( convertToJSON function )

##### Example Input

```code
FROM nginx:latest
RUN [ "adduser", "--disabled-password", "-gecos", "", "testuser" ]
VOLUME /home/testuser/app
USER testuser
WORKDIR /home/testuser/app
LABEL name=value
ENV env1=value1
ENV env2=value2
ADD test.run /home/testuser/app/test.run
COPY test.cmd /home/testuser/app/test.cmd
ENTRYPOINT [ "tail" ]
CMD [ "-f", "/dev/null" ]
EXPOSE 80/tcp
ARG value1
ARG value2
STOPSIGNAL stop
SHELL [ "/bin/bash", "-c", "echo", "hello"]
```

##### Example Output

```code
    {
      from: "nginx:latest",
      run: [ "adduser", "--disabled-password", "-gecos", "", "testuser" ],
      volumes: [ "/home/testuser/app" ],
      user: "testuser",
      working_dir: "/home/testuser/app",
      labels: {
        name: "value"
      },
      env: {
        env1: "value1",
        env2: "value2"
      },
      add: {
        'test.run' : '/home/testuser/app/test.run'
      },
      copy:  {
        'test.cmd' : '/home/testuser/app/test.cmd'
      },
      entrypoint: "tail",
      cmd: ["-f", "/dev/null"],
      expose: ["80/tcp"],
      args: [ "value1", "value2"],
      stopsignal: "stop",
      shell: [ "/bin/bash", "-c", "echo", "hello" ]
    }
```

#### Example for .dockerignore Generation ( generateIgnoreFile function )

##### Input
```code
['node_modules','.git']
```

##### Output

```code
node_modules
.git
```



### License

Copyright (c) 2015 Tibor Udvari. Released under the MIT license. See [LICENSE](https://github.com/tudvari/docker-composer/blob/master/LICENSE) for details.
