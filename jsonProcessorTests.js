const path = require('path')

const mocha = require('mocha')
const should = require('should')

const jsonProcessor = require(path.resolve(__dirname + '/lib/jsonProcessor'))

describe('jsonProcessorTests - determineTests', function() {

    it('determine - Single param', function(){
        let foundFunction = jsonProcessor.determineFunction('FROM nginx:latest')
        foundFunction.name.should.equal('processFROM')
    })

    it('determine - Single param', function(){
        let foundFunction = jsonProcessor.determineFunction('EXPOSE 80/tcp')
        foundFunction.name.should.equal('processEXPOSE')
    })

    it('determine - mutliple params (array)', function(){
        let resp = jsonProcessor.determineFunction('CMD ["test.cmd","-b","param"]')
        resp.name.should.equal('processCMD')
    })

    it('determine - mutliple params (array)', function(){
        let resp = jsonProcessor.determineFunction('RUN ["test.run","-b","param"]')
        resp.name.should.equal('processRUN')
    })

    it('determine - mutliple params (array)', function(){
        let resp = jsonProcessor.determineFunction('ENTRYPOINT ["test.run","-b","param"]')
        resp.name.should.equal('processENTRYPOINT')
    })

    it('determine - mutliple params (simple params)', function(){
        let resp = jsonProcessor.determineFunction('COPY src dst')
        resp.name.should.equal('processCOPY')
    })

    it('determine - key-value pair', function(){
        let resp = jsonProcessor.determineFunction('LABEL key=value')
        resp.name.should.equal('processLABEL')
    })

    it('determine - key-value pair', function(){
        let resp = jsonProcessor.determineFunction('LABEL key=value')
        resp.name.should.equal('processLABEL')
    })

    it('determine - key-value pair', function(){
        let resp = jsonProcessor.determineFunction('ENV key=value')
        resp.name.should.equal('processENV')
    })
})

describe('jsonProcessorTests - processTests', function(){
    it('process - FROM', function(){
        let foundFunction = jsonProcessor.determineFunction('FROM nginx:latest')
        foundFunction.name.should.equal('processFROM')
        
        // call the function
        let respObject = foundFunction('FROM nginx:latest')

        respObject.from.should.be.equal('nginx:latest')
    })

    it('process - EXPOSE', function(){
        let foundFunction = jsonProcessor.determineFunction('EXPOSE 80/tcp')
        foundFunction.name.should.equal('processEXPOSE')
        
        // call the function
        let respObject = foundFunction('EXPOSE 80/tcp')

        respObject.expose.should.be.equal('80/tcp')
    })

    it('process - CMD', function(){
        let foundFunction = jsonProcessor.determineFunction('CMD ["test.cmd","-b","param"]')
        foundFunction.name.should.equal('processCMD')

        //call the function
        let respObject = foundFunction('CMD ["test.cmd","-b","param"]')

        let expectedArray = new Array()
        expectedArray.push("test.cmd")
        expectedArray.push("-b")
        expectedArray.push("param")

        respObject.cmd.should.be.eql(expectedArray)
    })

    it('process - RUN', function(){
        let foundFunction = jsonProcessor.determineFunction('RUN ["test.run","-b","param"]')
        foundFunction.name.should.equal('processRUN')

        //call the function
        let respObject = foundFunction('RUN ["test.run","-b","param"]')

        let expectedArray = new Array()
        expectedArray.push("test.run")
        expectedArray.push("-b")
        expectedArray.push("param")

        respObject.run.should.be.eql(expectedArray)
    })

    it('process - ENTRYPOINT', function(){
        let foundFunction = jsonProcessor.determineFunction('ENTRYPOINT ["test.run","-b","param"]')
        foundFunction.name.should.equal('processENTRYPOINT')

        //call the function
        let respObject = foundFunction('ENTRYPOINT ["test.run","-b","param"]')

        let expectedArray = new Array()
        expectedArray.push("test.run")
        expectedArray.push("-b")
        expectedArray.push("param")

        respObject.entrypoint.should.be.eql(expectedArray)
    })

    it('process - COPY', function(){
        let foundFunction = jsonProcessor.determineFunction('COPY src dst')
        foundFunction.name.should.equal('processCOPY')

        //call the function
        let respObject = foundFunction('COPY src dst')

        let expectedArray = {}
        expectedArray['src'] = 'dst'

        respObject.copy.should.be.eql(expectedArray)
    })

    it('process - ADD', function(){
        let foundFunction = jsonProcessor.determineFunction('ADD src dst')
        foundFunction.name.should.equal('processADD')

        //call the function
        let respObject = foundFunction('ADD src dst')

        let expectedArray = {}
        expectedArray['src'] = 'dst'

        respObject.add.should.be.eql(expectedArray)
    })

    it('process - LABEL', function(){
        let foundFunction = jsonProcessor.determineFunction('LABEL key=value')
        foundFunction.name.should.equal('processLABEL')

        //call the function
        let respObject = foundFunction('LABEL key=value')
        console.log(respObject)
        let expectedArray = {}
        expectedArray['key'] = 'value'

        respObject.label.should.be.eql(expectedArray)
    })

    it('process - ENV', function(){
        let foundFunction = jsonProcessor.determineFunction('ENV key=value')
        foundFunction.name.should.equal('processENV')

        //call the function
        let respObject = foundFunction('ENV key=value')
        console.log(respObject)
        let expectedArray = {}
        expectedArray['key'] = 'value'

        respObject.env.should.be.eql(expectedArray)
    })
})