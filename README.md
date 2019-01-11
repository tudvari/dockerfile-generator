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

#### Version 3.1.0 ( 2019.01.XX)

- Refactor of the Dockerfile generation functionality.
- Refactor of the JSON creation from a Dockerfile

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

#### Example for Dockerfile Generation

##### Input

```json
    {
      from: "nginx:latest",
      run: "test.run",
      cmd: "test.cmd",
      labels: {
        name: "value"
      },
      env: {
        env1: "value1",
        env2: "value2"
      },
      add: {
        '/home/src1' : '/home/dst1',
        '/home/src2' : '/home/dst2'
      },
      copy:  {
        '/home/src1' : 'dst1',
        '/home/src2' : 'dst2'
      },
      expose: ["80/tcp"],
      entrypoint: "/home/test",
      volumes: [ "/home/testvolume" ],
      user: "testuser",
      working_dir : "/home/app",
      args: [ "value1", "value2"],
      stopsignal: "stop",
      shell: [ "cmd", "param1", "param2" ]
    }
```

##### Output

```code
FROM nginx:latest
RUN [ "test.run" ]
CMD [ "test.cmd" ]
LABEL name=value
ENV env1=value1
ENV env2=value2
ADD /home/src1 /home/dst1
ADD /home/src2 /home/dst2
COPY /home/src1 dst1
COPY /home/src2 dst2
EXPOSE 80/tcp
ENTRYPOINT [ "/home/test" ]
VOLUME /home/testvolume
USER testuser
WORKDIR /home/app
ARG value1
ARG value2
STOPSIGNAL stop
SHELL [ "cmd", "param1", "param2" ]
```

### License

Copyright (c) 2015 Tibor Udvari. Released under the MIT license. See [LICENSE](https://github.com/tudvari/docker-composer/blob/master/LICENSE) for details.
