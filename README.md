# Dockerfile Generator


## Example input

{
    "imagename": "node",
    "image_version": "4.1.2",
    "copy": [
        {
            "src": "path/to/src",
            "dst": "/path/to/dst"
        },
        {
            "src": "path/to/src",
            "dst": "/path/to/dst"
        },
        {
            "src": "path/to/src",
            "dst": "/path/to/dst"
        }
    ],
    "cmd": "command",
    "run": [
        {
            "command": "arguments"
        },
        {
            "command": "arguments"
        },
        {
            "command": "arguments"
        }
    ],
    "expose": [
        123,
        456,
        789
    ]
}
