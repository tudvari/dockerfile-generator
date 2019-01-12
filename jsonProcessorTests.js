const path = require('path')

const mocha = require('mocha')
const should = require('should')

const jsonProcessor = require(path.resolve(__dirname + '/lib/jsonProcessor'))

describe('jsonProcessorTests - determineTests', function() {

    it('determine - Single param', function(){
        let foundFunction = jsonProcessor.determineFunction('FROM nginx:latest')
        foundFunction.name.should.equal('processFROM')
    })

    it('determine - mutliple params (array)', function(){
        let resp = jsonProcessor.determineFunction('CMD ["test.cmd","-b","param"]')
        resp.name.should.equal('processCMD')
    })

    it('determine - mutliple params (simple params)', function(){
        let resp = jsonProcessor.determineFunction('COPY src dst')
        resp.name.should.equal('processCOPY')
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

    it('process - COPY', function(){
        let foundFunction = jsonProcessor.determineFunction('COPY src dst')
        foundFunction.name.should.equal('processCOPY')

        //call the function
        let respObject = foundFunction('COPY src dst')

        let expectedArray = {}
        expectedArray['src'] = 'dst'

        respObject.copy.should.be.eql(expectedArray)
    })
})