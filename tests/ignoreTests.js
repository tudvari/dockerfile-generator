const {describe, it} = require('@jest/globals');

const generator = require('../index.js');

describe('.dockerignore generate tests', () => {
  it('Empty Array', async () => {
    const resp = await generator.generateIgnoreFile([]);
    expect(resp).toEqual('');	  
  });

  it('One Item in the Array', async () => {
    const resp = await generator.generateIgnoreFile(['node_modules']);
    expect(resp).toEqual('node_modules\n');
  });

  it('Multiple Item in the Array', async () => {
    const resp = await generator.generateIgnoreFile(['node_modules', '.git']);
    expect(resp).toEqual('node_modules\n.git\n');	  
  });
});
