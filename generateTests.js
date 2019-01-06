const fs = require('fs')
const mocha = require('mocha')
const should = require('should')

const generator = require('./')

describe('dockerfile-generator', function () {

  it('Empty JSON as input - Validation Error', async function () {
    try {
      let resp = await generator.generate({} )
    }
    catch (err) {
      should.exist(err)
      err.message.should.equal('Input Validation error')
    }
  })

  it('JSON contains all element', async function () {
    let inputJSON = {
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
      add: [src1='dst1'],
      copy: [src1='dst1'],
      expose: ["80/tcp"],
      entrypoint: "/home/test",
      volumes: [ "/home/testvolume" ],
      user: "testuser",
      working_dir : "/home/app",
      args: [ arg1="value1", arg2="value2"],
      stopsignal: "stop",
      shell: [ "cmd", "param1", "param2" ]
       
    }

    try {
      let resp = await generator.generate(inputJSON)
      console.log(resp)
    }
    catch(error) {
      console.log('err >>>', error)
      should.not.exist(error)
    }
  })
})

/*
FROM nginx:latest
RUN [ "test.run" ]
CMD [ "test.cmd" ]
LABEL name=value
ENV env1=value1
ENV env2=value2
EXPOSE 80/tcp
ADD src1 dst1
COPY src1 dst1
ENTRYPOINT /home/test
VOLUME /home/testvolume
USER testuser
WORKDIR /home/app
ARG value1
ARG value2
STOPSIGNAL stop
SHELL [ "param1", "param2" ] 
*/
