const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, data, previousHash) {
        this.index = index;
        this.timestamp = new Date().getTime();
        this.data = data;
        this.previousHash = previousHash;
        this.calculateHash().then(hash => {this.hash = hash});
    }

    calculateHash = () => new Promise((resolve, reject) => {
        const dataAsString = `${this.index}${this.timestamp}${JSON.stringify(this.data)}${this.previousHash}`;
        const hash = SHA256(dataAsString).toString();
        resolve(hash);
    });

    isValid = () => new Promise((resolve, reject) => {
        if (typeof this.data !== 'object') {
            return false;
        }

        this.calculateHash().then(hash => {
            resolve(this.hash === hash);
        });
    });
}

module.exports = Block;