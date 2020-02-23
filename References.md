# Dockerfile-generator reference

The purpose of this document to collect the supported keywords with examples.

# Supported keywords

- [from](#from)
- [run](#run)
- [cmd](#cmd)
- [labels](#labels)
- [expose](#expose)
- [env](#env)
- [add](#add)
- [copy](#copy)
- [entrypoint](#entrypoint)
- [volumes](#volumes)
- [user](#user)
- [working_dir](#working_dir)
- [args](#args)
- [onbuild](#onbuild)
- [shell](#shell)
- [comment](#comment)

# Keyword descriptions and examples

## FROM

### Keyword schema
```json
"from": {
    "type": "object",
    "properties": {
        "baseImage": {
            "type": "string"
        },
        "alias": {
            "type": "string"
        }
    },
    "required": ["baseImage"]
}
```
#### Properties

For multi-stage build we are able to use multiple form statement. Please see the multi-stage example.

##### Required properties
- baseImage: The name of the base image, what is the starting-point of this image.

##### Optional properties
- alias: The reference name of this build step. We are able to use the multi-stage builds.

#### Example usages

##### Simple usage
###### Input
```json
{ "from": { "baseImage": "nginx:latest" } }
```
###### Output
```javascript
FROM nginx:latest
```

##### Multi-stage usage
###### Input
```json
{ "from_1": { "baseImage": "nginx:latest", "alias": "http" } }
```
###### Output
```javascript
FROM nginx:latest AS http
```

## RUN

### Keyword schema
```json
"run" : {
    "oneOf": [
        {"type": "string"},
        {"type": "array", "items": {"type": "string"}}
    ]
}
```
#### Properties

##### Required properties
RUN has two forms
 - with one command: In this case the command is a runnable shell command. (Shell form)
 - with array, which contains a executable and the params of the executable. (Exec form)

#### Example usages

##### Shell form
###### Input
```json
{ "from": { "baseImage": "nginx:latest" }, "run": "test_runnable.sh" }
```
###### Output
```javascript
FROM nginx:latest
RUN [ "test_runnable.sh" ]
```

##### Exec form
###### Input
```json
{ "from": { "baseImage": "nginx:latest" }, "run": ["test_runnable.sh", "param1", "param2"] }
```
###### Output
```javascript
FROM nginx:latest
RUN [ "test_runnable.sh", "param1", "param2" ]
```

### CMD
### Keyword schema
```json
"cmd" : {
    "oneOf": [
        {"type": "string"},
        {"type": "array", "items": {"type": "string"}}
    ]
}
```
#### Properties

##### Required properties
CMD has two forms
 - with one command: In this case the command is a runnable shell command. (Shell form)
 - with array, which contains a executable and the params of the executable. (Exec form)

#### Example usages

##### Shell form
###### Input
```json
{ "from": { "baseImage": "nginx:latest" }, "cmd": "test.cmd" }
```
###### Output
```javascript
FROM nginx:latest
CMD [ "test.cmd"]
```

##### Exec form
###### Input
```json
{ "from": { "baseImage": "nginx:latest" }, "cmd": ["test.cmd", "-b"] }
```
###### Output
```javascript
FROM nginx:latest
CMD [ "test.cmd", "-b" ]
```

### LABELS
### Keyword schema
```json
"labels": {
    "oneOf": [
        {
            "type": "object",
            "patternProperties": {
                ".+": {
                    "type": "string"
                }
            },
            "additionalProperties": false
        },
        {"type": "array", "items": {"type": "string"}, "uniqueItems": true}
    ]
}
```
#### Properties

##### Required properties
Labels has two forms
 - Object: In this case the labels keyword is plain javascript object. The name of the label is the name of the attribute.
 - Array: In this case the labels keyword is array. The name of the label is the key of the element inside the array.

#### Example usages

##### Object form
###### Input
```javascript
const labels = {
      key1: 'value1',
      key2: 'value2',
};

{ "from": { "baseImage": "nginx:latest" }, "labels": labels }
```
###### Output
```javascript
FROM nginx:latest
LABEL key1=value1
LABEL key2=value2
```

##### Array form
###### Input
```javascript
const labels = [];
labels.key1 = 'value1';
labels.key2 = 'value2';

{ "from": { "baseImage": "nginx:latest" }, "labels": labels }
```
###### Output
```javascript
FROM nginx:latest
LABEL key1=value1
LABEL key2=value2
```

### EXPOSE
### Keyword schema
```json
"expose": {
    "type": "array",
    "items": {
        "type": ["string", "number"],
        "format": "expose"
    },
    "uniqueItems": true
}
```
#### Properties

##### Required properties
- A array which contains the list of exposed ports.
#### Example usages

###### Input
```javascript
const expose = ['80', '22', '443'];

{ from: { baseImage: 'nginx:latest' }, "expose": expose}
```
###### Output
```javascript
FROM nginx:latest
EXPOSE 80
EXPOSE 22
EXPOSE 443
```

### ENV
### Keyword schema
```json
"env": {
    "oneOf": [
        {
            "type": "object",
            "patternProperties": {
                ".+": {
                    "type": ["string", "number", "null"]
                }
            },
            "additionalProperties": false
        },
        {"type": "array", "items": {"type": "string"}, "uniqueItems": true}
    ]
}
```
#### Properties

##### Required properties
ENV has two forms
 - Object: In this case the ENV keyword is plain javascript object. The name of the variable is the name of the attribute.
 - Array: In this case the ENV keyword is array. The name of variable is the key of the element inside the array.

#### Example usages

##### Object form
###### Input
```javascript
 const env = {
    key1: 'value1',
    key2: 'value2',
};

{ "from": { "baseImage": "nginx:latest" }, "env": env }
```
###### Output
```javascript
FROM nginx:latest
ENV key1=value1
ENV key2=value2
```

##### Array form
###### Input
```javascript
const env = [];
env.key1 = 'value1';
env.key2 = 'value2';

{ "from": { "baseImage": "nginx:latest" }, "env": env }
```
###### Output
```javascript
FROM nginx:latest
ENV key1=value1
ENV key2=value2
```

### ADD
### Keyword schema
```json
"add": { 
    "oneOf": [
        {"type": "array", "items": {"type": "string"}},
        {"type": "object"}
    ]
}
```
#### Properties

##### Required properties
ADD has two forms
 - Object: In this case the ADD keyword is plain javascript object. The source of the added file is the name of the attribute. The destination is the value of the attribute.
 - Array: In this case the ADD keyword is array. The source of the added file is the key of the item. The destination is the value of the item.

#### Example usages

##### Object form
###### Input
```javascript
const add = {};
add.key1 = 'value1';
add.key2 = 'value2';

{ "from": { "baseImage": "nginx:latest" }, "add": add }
```
###### Output
```javascript
FROM nginx:latest
ADD key1 value1
ADD key2 value2
```

##### Array form
###### Input
```javascript
const add = [];
add.key1 = 'value1';
add.key2 = 'value2';

{ "from": { "baseImage": "nginx:latest" }, "add": add }
```
###### Output
```javascript
FROM nginx:latest
ADD key1 value1
ADD key2 value2
```

### COPY
### Keyword schema
```json
"copy": { 
    "oneOf": [
        {"type": "array", "items": {"type": "string"}},
        {"type": "object"}
    ]
}
```
#### Properties

##### Required properties
COPY has two forms
 - Object: In this case the COPY keyword is plain javascript object. The source of the copied file is the name of the attribute. The destination is the value of the attribute.
 - Array: In this case COPY keyword is array. The source of the copied file is the key of the item. The destination is the value of the item.

 For multi-stage builds we can use a --from switch with a copy keyword. Please see the multi-stage example below.

#### Example usages

##### Object form
###### Input
```javascript
const copy = {};
copy.key1 = 'value1';
copy.key2 = 'value2';

{ "from": { "baseImage": "nginx:latest" }, "copy": copy }
```
###### Output
```javascript
FROM nginx:latest
COPY key1 value1
COPY key2 value2
```

##### Array form
###### Input
```javascript
const copy = [];
copy.key1 = 'value1';
copy.key2 = 'value2';

{ "from": { "baseImage": "nginx:latest" }, "copy": copy }
```
###### Output
```javascript
FROM nginx:latest
COPY key1 value1
COPY key2 value2
```

##### Multi-stage
###### Input
```javascript
const copy = {};
copy.key1 = 'value1';
copy.key2 = 'value2';
copy.from = 0;

{ "from": { "baseImage": "nginx:latest" }, "copy": copy }
```
###### Output
```javascript
FROM nginx:latest
COPY --from=0 key1 value1
COPY --from=0 key2 value2
```

### ENTRYPOINT
### Keyword schema
```json
"entrypoint": { 
    "oneOf": [
        {"type": "array", "items": {"type": "string"}},
        {"type": "object"}
    ]
}
```
#### Properties

##### Required properties
ENTRYPOINT has two forms
 - Object: In this case the ENTRYPOINT is a single string. This string is a name of a executable shell script.
 - Array: In this case COPY ENTRYPOINT is array. This array contains a executable shell script with parameters of the script.

#### Example usages

##### Object form
###### Input
```javascript
{ "from": { "baseImage": "nginx:latest" }, "entrypoint": "test_runnable.sh" }
```
###### Output
```javascript
FROM nginx:latest
ENTRYPOINT [ "test_runnable.sh" ]
```

##### Array form
###### Input
```javascript
const entrypoint = ['test_runnable.sh', 'param1', 'param2'];

{ "from": { "baseImage": "nginx:latest" }, "entrypoint": entrypoint }
```
###### Output
```javascript
FROM nginx:latest
ENTRYPOINT [ "test_runnable.sh", "param1", "param2" ]
```

### VOLUMES
### Keyword schema
```json
"volumes": {
    "type": "array", 
    "items": {
        "type": "string"
    }, 
    "uniqueItems": true
}
```
#### Properties

##### Required properties
Volumes is array, which contains the path of the volumes.

#### Example usages

###### Input
```javascript
const volumes = ['/home/app/1', '/home/app/2'];

{ "from": { "baseImage": "nginx:latest" }, "volumes": volumes }
```
###### Output
```javascript
FROM nginx:latest
VOLUME /home/app/1
VOLUME /home/app/2
```

### USER
### Keyword schema
```json
"user": {
    "type": "string"
}
```
#### Properties

##### Required properties
- The name of the user, which is a string.

#### Example usages

###### Input
```javascript
{ from: { baseImage: 'nginx:latest' }, user: 'username' }
```
###### Output
```javascript
FROM nginx:latest
USER username
```

### WORKING_DIR
### Keyword schema
```json
"working_dir": {
    "type": "string"
}
```
#### Properties

##### Required properties
- The full path of the working directory.

#### Example usages

###### Input
```javascript
{ from: { baseImage: 'nginx:latest' }, working_dir: '/home/app' }
```
###### Output
```javascript
FROM nginx:latest
WORKDIR /home/app
```

### ARGS
### Keyword schema
```json
"args": {
    "oneOf": [
        {"type": "array", "items": {"type": "string"}, "uniqueItems": true}
    ]
}
```
#### Properties

##### Required properties
ARGS is array, which contains the values of the required arguments.

#### Example usages

###### Input
```javascript
{ "from": { "baseImage": "nginx:latest" }, "args": ['arg1', 'arg2'] }
```
###### Output
```javascript
FROM nginx:latest
ARG arg1
ARG arg2
```

### STOPSIGNAL
### Keyword schema
```json
"stopsignal": {
    "type": "string"
}
```
#### Properties

##### Required properties
- The full path of the working directory.

#### Example usages

###### Input
```javascript
{ from: { baseImage: 'nginx:latest' }, stopsignal: 'signal' }
```
###### Output
```javascript
FROM nginx:latest
STOPSIGNAL signal
```

### SHELL
### Keyword schema
```json
"shell": {
    "type": "array", "items": {"type": "string"}, "uniqueItems": true
}
```
#### Properties

##### Required properties
SHELL is array, which contains the executable and params of the shell command.

#### Example usages

###### Input
```javascript
{ "from": { "baseImage": "nginx:latest" }, "shell": ['executable', 'arg1', 'arg2'] }
```
###### Output
```javascript
FROM nginx:latest
SHELL ["executable", "arg1", "arg2"]
```

### COMMENT
### Keyword schema
```json
"comment" : {
    "type": "string"
}
```

We are able to user multiple comment, for this we have to use the comment keyword with a suffix. Please see the example below.
#### Properties

##### Required properties
COMMENT is a string.

#### Example usages

##### Single comment
###### Input
```javascript
{ "from": { "baseImage": "nginx:latest" }, "comment": "single comment" }
```
###### Output
```javascript
FROM nginx:latest
# single comment
```

##### Multiple comment
###### Input
```javascript
{ "from": { "baseImage": "nginx:latest" }, "comment_1": "first comment","comment_2": "second comment" }
```
###### Output
```javascript
FROM nginx:latest
# first comment
# second comment
```
