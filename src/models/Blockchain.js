const Block = require('./Block.js');
const GenesisBlock = require('./GenesisBlock.js');
const bitcoinMessage = require('bitcoinjs-message');

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

    getBlockchanByOwner = (owner) => new Promise((resolve, reject) => {
        let blockData = [];
        this.chain.forEach(block => {
            block.getBData().then(data => {
                if (data !== null) {
                    if (data.owner == owner) {
                        blockData.push(data);
                    }                    
                }  
            });          
        });
        resolve(blockData); 
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

    requestValidation = (address) => new Promise((resolve, reject) => {
        let message = `${address}:${new Date().getTime().toString().slice(0,-3)}:infoRegistry`;
        resolve(message);  
    });

    addBlockSigned = (address, message, signature, info) => new Promise((resolve, reject) => {
        let time = parseInt(message.split(':')[1]);
        let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
        let timeElapsed = currentTime - time;

        if (timeElapsed > 5 * 60) {
            throw new Error('Time elapsed is greater than 5 minutes');
        }

        let isValid = bitcoinMessage.verify(message, address, signature);
        if (!isValid) {
            throw new Error('Invalid signature');
        }

        this.addBlock({ owner: address, info }).then(addedBlock => {
            resolve(addedBlock);  
        });   
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