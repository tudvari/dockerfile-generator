# Dockerfile Generator

The main goal of this module generate a dockerfile in runtime from the input data which is a JSON document.

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
    "expose": [
        123,
        456,
        789
    ]
}
```
## Usage

```Javascript
var generator = require('dockerfile-generator') ;

generator.generate(inputJSON,function(err,result){
  //do something with the result..
}) ;
```
