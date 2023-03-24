const Block = require('./Block.js');
const GenesisBlock = require('./GenesisBlock.js');

class Blockchain {
    constructor() {
        this.chain = [];
        this._createGenesisBlock();
    }

    _createGenesisBlock() {
        if (this.chain.length == 0) {
            const genesisBlock = new GenesisBlock();
            this.chain.push(genesisBlock);
        }
    }

    getLatestBlock = () => {
        return this.chain[this.chain.length - 1];
    }

    getBlockByIndex = (index) => {
        let block = this.chain.find(p => p.index === index);
        return block; 
    }

    getBlockByHash = (hash) => {
        let block = this.chain.find(p => p.hash === hash);
        return block; 
    }

    isValid = () => {
        if (this.chain.length === 0) {
            return false;
        }

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            if (!currentBlock.isValid()) {
                return false;
            }
        }
        return true;
    }

    addBlock = (data) => {
        if (!data || typeof data !== 'object') {
            throw new Error('Block data must be an object');
        }

        const newBlock = new Block(this.chain.length, data, this.getLatestBlock().hash)
        this.chain.push(newBlock);
        return newBlock;
    }
}

module.exports = Blockchain;