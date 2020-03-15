# Release Notes

## Version 4.0.1 (15.03.2020)
- Vulnerable dependency update
    * More details: https://github.com/advisories/GHSA-7fhm-mqm4-2wp7

## Version 4.0.0 (23.02.2020)
- Multi-stage build support
- Multiple comment support
- Documentation update
- Dependency update

## Version 3.3.0 (22.01.2020)
- Comment handling

## Version 3.2.4 (01.12.2019)
- Update dependencies

## Version 3.2.3 (24.11.2019)
- Replace instanbul with nyc
- Update dependencies
- Reduce published npm package size

## Version 3.2.2 (13.07.2019)
- This is a maintenance release, it contains only dependency updates.

## Version 3.2.1 (06.06.2019)

- This is a maintenance release, it contains only dependency updates.

## Version 3.2.0 (14.04.2019)

- generateDockerFileFromArray function: Generate the Dockerfile from a Array. It can have mulitple instance from one command for example: copy and add
- small linting fixes

## Version 3.1.1 (18.02.2019)

- linting, gulp support

## Version 3.1.0 (20.01.2019)

- Refactor of the Dockerfile generation functionality.
- Refactor of the JSON creation from a Dockerfile.

## Version 3.0.0 (22.04.2018)

- Change from callback to Promise for async/await support.

## Version 2.1.1 (29.12.2017)
- Refresh dependencies.

## Version 2.1.0 (05.03.2016)

- New functionality: Generating .dockerignore file

## Version 2.0.0 (21.12.2015)

- New functionality implemented: It is possible to convert a Dockerfile to JSON object. You can use the convertToJSON function in this package. For example check the documentation.
- Syntax rules removed. You have to make sure in the future.

## Version 1.0.0 and Version 1.0.1 (29.11.2015)

- First public version
- Supported keywords: from (imagename and imageversion), copy, run, expose, cmd, env, workdir
