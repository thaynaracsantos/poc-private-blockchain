const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, data, previousHash) {
        this.index = index;
        this.timestamp = new Date().getTime();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash = () => {
        const dataAsString = `${this.index}${this.timestamp}${JSON.stringify(this.data)}${this.previousHash}`;
        const hash = SHA256(dataAsString).toString();
        return hash;
    }

    isValid = () => {
        if (typeof this.data !== 'object') {
            return false;
        }
        return this.calculateHash() === this.hash;
    }
}

module.exports = Block;