const Block = require('./Block.js');

class GenesisBlock extends Block {
    constructor() {
        super(0, 'Genesis block', '');
    }
}

module.exports = GenesisBlock;