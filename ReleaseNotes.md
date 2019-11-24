# Release Notes

## Version 3.2.3 (2019.11.24)
- Replace instanbul with nyc
- Update dependencies
- Reduce published npm package size

## Version 3.2.2 (2019.07.13)
- This is a maintenance release, it contains only dependency updates.

## Version 3.2.1 (2019.06.06)

- This is a maintenance release, it contains only dependency updates.

## Version 3.2.0 (2019.04.14)

- generateDockerFileFromArray function: Generate the Dockerfile from a Array. It can have mulitple instance from one command for example: copy and add
- small linting fixes

## Version 3.1.1 (2019.02.18)

- linting, gulp support

## Version 3.1.0 (2019.01.20)

- Refactor of the Dockerfile generation functionality.
- Refactor of the JSON creation from a Dockerfile.

## Version 3.0.0 (2018.04.22)

- Change from callback to Promise for async/await support.

## Version 2.1.1 (2017.12.29)
- Refresh dependencies.

## Version 2.1.0 (2016.03.05)

- New functionality: Generating .dockerignore file

## Version 2.0.0 (2015.12.21)

- New functionality implemented: It is possible to convert a Dockerfile to JSON object. You can use the convertToJSON function in this package. For example check the documentation.
- Syntax rules removed. You have to make sure in the future.

## Version 1.0.0 and Version 1.0.1 (2015.11.29)

- First public version released
- Supported keywords: from (imagename and imageversion),copy,run,expose,cmd,env,workdir
