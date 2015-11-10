# Dockerfile Generator


## Example input

{
  "image" : "node",
  "image_version" : "4.1.2",
  "copy" : [ {"src" : "dst"}, {"src" : "dst"}, {"src" : "dst"}],
  "cmd" : "command",
  "run" : [ {"command" : "arguments"},{"command" : "arguments"},{"command" : "arguments"}],
  "expose" : [123,456,789]
}
