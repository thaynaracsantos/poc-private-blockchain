const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {
    constructor(index, data, previousHash) {
        this.index = index;
        this.timestamp = new Date().getTime();
        this.data = Buffer.from(JSON.stringify(data)).toString('hex');
        this.previousHash = previousHash;
        this.calculateHash().then(hash => {this.hash = hash});
    }

    calculateHash = () => new Promise((resolve, reject) => {
        const dataAsString = `${this.index}${this.timestamp}${this.data}${this.previousHash}`;
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

    getBData = () => new Promise((resolve, reject) => {
        if (this.index === 0) {
            resolve(null);
        }

        let encodedData = this.data;
        const decodedData = hex2ascii(encodedData);
        const parsedData = JSON.parse(decodedData);    
        resolve(parsedData);
    });
}

module.exports = Block;