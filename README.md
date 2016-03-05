# Dockerfile Generator

The main goal of this module generate a Dockerfile in runtime from the input data which is a JSON document.

## Ruleset

- imagename : String type.
- imageversion : String type.
- copy : Array of objects. This object has two required property SRC for the source directory and DST for the destination directory.
- cmd : Array of a object, this object has two required property COMMAND - the executable command- and ARGS, which is array of arguments.
- run : Array of objects, it has two property: COMMAND - executable command - and ARGS as arguments of the executable command.
- expose : Array of ports.
- env : Array of objects it has two property: ENVNAME - name of the environment variable -and ENVVALUE value of the environment variable.
- workdir : Define the working directory.

## Example input
```json
{
    "imagename": "node",
    "imageversion": "4.1.2",
    "copy": [
        {
            "src": "path/to/src",
            "dst": "/path/to/dst"
        },
        {
            "src": "path/to/src",
            "dst": "/path/to/dst"
        }
    ],
    "cmd": {
      "command" : "cmd",
      "args" : ["arg1","arg2"]
    },
    "workdir" : "/app",
    "run": [
        {
            "command": "command",
            "args": [
                "arg"
            ]
        },
        {
            "command": "command",
            "args": [
                "arg1",
                "arg2"
            ]
        },
        {
            "command": "command"
        }
    ],
    "env" : [
      {"envname" : "TESTENV1",
       "envvalue" : "testvalue1"
     },
     {"envname" : "TESTENV2",
      "envvalue" : "testvalue2"
     }
   ],
    "expose": [
        123,
        456,
        789
    ]
}
```

## Example output

```yml
FROM node:4.1.2
COPY path/to/src /path/to/dst
COPY path/to/src /path/to/dst
WORKDIR /app
RUN ["command","arg"]
RUN ["command","arg1","arg2"]
RUN ["command"]
ENV TESTENV1=testvalue1
ENV TESTENV2=testvalue2
EXPOSE 123
EXPOSE 456
EXPOSE 789
CMD ["cmd","arg1","arg2"]
```
## Usage

```Javascript
var generator = require('dockerfile-generator') ;

generator.generate(inputJSON,function(err,result){
  //Result is a generated Dockerfile.

  //do something with the result..
}) ;

generator.convertToJSON(inputDockerFile,function(err,result)){
  //Result is a converted JSON Object.

  //do something with the result..
}

generator.generateIgnoreFile(ignoredElementsArray,function(err,result)){
  //Result is a generated .dockerignore file
}
```

## Release Notes

You can read the changelist: [here](https://github.com/tudvari/dockerfile-generator/blob/master/ReleaseNotes.md)


## Metrics

[![Code Climate](https://codeclimate.com/github/tudvari/dockerfile-generator/badges/gpa.svg)](https://codeclimate.com/github/tudvari/dockerfile-generator)
[![Test Coverage](https://codeclimate.com/github/tudvari/dockerfile-generator/badges/coverage.svg)](https://codeclimate.com/github/tudvari/dockerfile-generator/coverage)
[![Build Status](https://travis-ci.org/tudvari/dockerfile-generator.svg?branch=master)](https://travis-ci.org/tudvari/dockerfile-generator)
