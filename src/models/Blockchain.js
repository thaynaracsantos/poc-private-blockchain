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

    getLatestBlock = () => new Promise((resolve, reject) => {
        const block = this.chain[this.chain.length - 1];
        resolve(block); 
    });

    getBlockByIndex = (index) => new Promise((resolve, reject) => {
        const block = this.chain.find(p => p.index === index);
        resolve(block); 
    });

    getBlockByHash = (hash) => new Promise((resolve, reject) => {
        const block = this.chain.find(p => p.hash === hash);
        resolve(block); 
    });

    isValid = () => new Promise((resolve, reject) => {
        if (this.chain.length === 0) {
            resolve(false);
        }

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.previousHash !== previousBlock.hash) {
                resolve(false);
            }

            currentBlock.isValid().then(isValid => {
                if (!isValid) {
                    resolve(false);
                }
            });
        }
        resolve(true);
    });

    addBlock = (data) => new Promise((resolve, reject) => {
        if (!data || typeof data !== 'object') {
            reject(new Error('Block data must be an object'));
        }

        this.getLatestBlock().then(block => {
            const newBlock = new Block(this.chain.length, data, block.hash);
            this.chain.push(newBlock);

            this.isValid().then(isValid => {
                if (isValid) {
                    resolve(newBlock);
                } else {
                    reject(new Error('The chain is invalid'));
                }

            });
        });
    });
}

module.exports = Blockchain;