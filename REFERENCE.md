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
- [stopsignal](#stopsignal)
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
```json
FROM nginx:latest
```

##### Multi-stage usage
###### Input
```json
{ "from": { "baseImage": "nginx:latest", "alias": "http" } }
```
###### Output
```json
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
```json
FROM nginx:latest
RUN [ "test_runnable.sh" ]
```

##### Exec form
###### Input
```json
{ "from": { "baseImage": "nginx:latest" }, "run": ["test_runnable.sh", "param1", "param2"] }
```
###### Output
```json
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
```json
FROM nginx:latest
CMD [ "test.cmd"]
```

##### Exec form
###### Input
```json
{ "from": { "baseImage": "nginx:latest" }, "cmd": ["test.cmd", "-b"] }
```
###### Output
```json
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
```json
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
```json
FROM nginx:latest
LABEL key1=value1
LABEL key2=value2
```

### expose
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
```json
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
```json
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
```json
FROM nginx:latest
ENV key1=value1
ENV key2=value2
```

### add
A Lorem Ipsum egy egyszerû szövegrészlete, szövegutánzata a betûszedõ és nyomdaiparnak. A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban; mikor egy ismeretlen nyomdász összeállította a betûkészletét és egy példa-könyvet vagy szöveget nyomott papírra, ezt használta. Nem csak 5 évszázadot élt túl, de az elektronikus betûkészleteknél is változatlanul megmaradt. Az 1960-as években népszerûsítették a Lorem Ipsum részleteket magukbafoglaló Letraset lapokkal, és legutóbb softwarekkel mint például az Aldus Pagemaker
### copy
A Lorem Ipsum egy egyszerû szövegrészlete, szövegutánzata a betûszedõ és nyomdaiparnak. A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban; mikor egy ismeretlen nyomdász összeállította a betûkészletét és egy példa-könyvet vagy szöveget nyomott papírra, ezt használta. Nem csak 5 évszázadot élt túl, de az elektronikus betûkészleteknél is változatlanul megmaradt. Az 1960-as években népszerûsítették a Lorem Ipsum részleteket magukbafoglaló Letraset lapokkal, és legutóbb softwarekkel mint például az Aldus Pagemaker
### entrypoint
A Lorem Ipsum egy egyszerû szövegrészlete, szövegutánzata a betûszedõ és nyomdaiparnak. A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban; mikor egy ismeretlen nyomdász összeállította a betûkészletét és egy példa-könyvet vagy szöveget nyomott papírra, ezt használta. Nem csak 5 évszázadot élt túl, de az elektronikus betûkészleteknél is változatlanul megmaradt. Az 1960-as években népszerûsítették a Lorem Ipsum részleteket magukbafoglaló Letraset lapokkal, és legutóbb softwarekkel mint például az Aldus Pagemaker
### volumes
A Lorem Ipsum egy egyszerû szövegrészlete, szövegutánzata a betûszedõ és nyomdaiparnak. A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban; mikor egy ismeretlen nyomdász összeállította a betûkészletét és egy példa-könyvet vagy szöveget nyomott papírra, ezt használta. Nem csak 5 évszázadot élt túl, de az elektronikus betûkészleteknél is változatlanul megmaradt. Az 1960-as években népszerûsítették a Lorem Ipsum részleteket magukbafoglaló Letraset lapokkal, és legutóbb softwarekkel mint például az Aldus Pagemaker
### user
A Lorem Ipsum egy egyszerû szövegrészlete, szövegutánzata a betûszedõ és nyomdaiparnak. A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban; mikor egy ismeretlen nyomdász összeállította a betûkészletét és egy példa-könyvet vagy szöveget nyomott papírra, ezt használta. Nem csak 5 évszázadot élt túl, de az elektronikus betûkészleteknél is változatlanul megmaradt. Az 1960-as években népszerûsítették a Lorem Ipsum részleteket magukbafoglaló Letraset lapokkal, és legutóbb softwarekkel mint például az Aldus Pagemaker
### working_dir
A Lorem Ipsum egy egyszerû szövegrészlete, szövegutánzata a betûszedõ és nyomdaiparnak. A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban; mikor egy ismeretlen nyomdász összeállította a betûkészletét és egy példa-könyvet vagy szöveget nyomott papírra, ezt használta. Nem csak 5 évszázadot élt túl, de az elektronikus betûkészleteknél is változatlanul megmaradt. Az 1960-as években népszerûsítették a Lorem Ipsum részleteket magukbafoglaló Letraset lapokkal, és legutóbb softwarekkel mint például az Aldus Pagemaker
### args
A Lorem Ipsum egy egyszerû szövegrészlete, szövegutánzata a betûszedõ és nyomdaiparnak. A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban; mikor egy ismeretlen nyomdász összeállította a betûkészletét és egy példa-könyvet vagy szöveget nyomott papírra, ezt használta. Nem csak 5 évszázadot élt túl, de az elektronikus betûkészleteknél is változatlanul megmaradt. Az 1960-as években népszerûsítették a Lorem Ipsum részleteket magukbafoglaló Letraset lapokkal, és legutóbb softwarekkel mint például az Aldus Pagemaker
### onbuild
A Lorem Ipsum egy egyszerû szövegrészlete, szövegutánzata a betûszedõ és nyomdaiparnak. A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban; mikor egy ismeretlen nyomdász összeállította a betûkészletét és egy példa-könyvet vagy szöveget nyomott papírra, ezt használta. Nem csak 5 évszázadot élt túl, de az elektronikus betûkészleteknél is változatlanul megmaradt. Az 1960-as években népszerûsítették a Lorem Ipsum részleteket magukbafoglaló Letraset lapokkal, és legutóbb softwarekkel mint például az Aldus Pagemaker
### stopsignal
A Lorem Ipsum egy egyszerû szövegrészlete, szövegutánzata a betûszedõ és nyomdaiparnak. A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban; mikor egy ismeretlen nyomdász összeállította a betûkészletét és egy példa-könyvet vagy szöveget nyomott papírra, ezt használta. Nem csak 5 évszázadot élt túl, de az elektronikus betûkészleteknél is változatlanul megmaradt. Az 1960-as években népszerûsítették a Lorem Ipsum részleteket magukbafoglaló Letraset lapokkal, és legutóbb softwarekkel mint például az Aldus Pagemaker
### shell
A Lorem Ipsum egy egyszerû szövegrészlete, szövegutánzata a betûszedõ és nyomdaiparnak. A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban; mikor egy ismeretlen nyomdász összeállította a betûkészletét és egy példa-könyvet vagy szöveget nyomott papírra, ezt használta. Nem csak 5 évszázadot élt túl, de az elektronikus betûkészleteknél is változatlanul megmaradt. Az 1960-as években népszerûsítették a Lorem Ipsum részleteket magukbafoglaló Letraset lapokkal, és legutóbb softwarekkel mint például az Aldus Pagemaker
### comment
A Lorem Ipsum egy egyszerû szövegrészlete, szövegutánzata a betûszedõ és nyomdaiparnak. A Lorem Ipsum az 1500-as évek óta standard szövegrészletként szolgált az iparban; mikor egy ismeretlen nyomdász összeállította a betûkészletét és egy példa-könyvet vagy szöveget nyomott papírra, ezt használta. Nem csak 5 évszázadot élt túl, de az elektronikus betûkészleteknél is változatlanul megmaradt. Az 1960-as években népszerûsítették a Lorem Ipsum részleteket magukbafoglaló Letraset lapokkal, és legutóbb softwarekkel mint például az Aldus Pagemaker
