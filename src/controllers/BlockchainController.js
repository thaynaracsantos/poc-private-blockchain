const BaseController = require('./BaseController.js');
const Blockchain = require('../models/Blockchain.js');

class BlockchainController extends BaseController {
    constructor(app) {
        super();
        this.app = app;

        this.blockchain = new Blockchain()

        this.app.get('/blockchain/ping', this.handleRequest(this.getPing));
        this.app.get('/blockchain/block/latest', this.handleRequest(this.getLatestBlock));
        this.app.get('/blockchain/block/index/:index', this.handleRequest(this.getBlockByIndex));
        this.app.get('/blockchain/block/hash/:hash', this.handleRequest(this.getBlockByHash));
        this.app.get('/blockchain/is-valid', this.handleRequest(this.isValidBlockchain));    
        this.app.post('/blockchain/block', this.handleRequest(this.addBlock)); 
        this.app.get('/blockchain/owner/:owner', this.handleRequest(this.getBlockchanByOwner));
        this.app.post('/blockchain/block/signed', this.handleRequest(this.addBlockSigned)); 
        this.app.post('/blockchain/owner/request-validation', this.handleRequest(this.requestValidation)); 
    }

    getPing = async (req, res) => {        
        req.logger.info('Ping OK!');
        res.status(200).json('Pong!');
    };

    getLatestBlock = async (req, res) => {      
        const latestBlock = await this.blockchain.getLatestBlock();  
        req.logger.info(latestBlock);
        res.status(200).json(latestBlock);
    };

    getBlockByIndex = async (req, res) => {  
        const index = parseInt(req.params.index);    
        const block = await this.blockchain.getBlockByIndex(index);  
        if (block !== null) {
            req.logger.info(block);
            res.status(200).json(block);
        } else {
            res.status(404).json(`The block with index ${index} was not found.`);
        }
    };

    getBlockByHash = async (req, res) => {  
        const hash = req.params.hash;    
        const block = await this.blockchain.getBlockByHash(hash);  
        if (block !== null) {
            req.logger.info(block);
            res.status(200).json(block);
        } else {
            res.status(404).json(`The block with hash ${hash} was not found.`);
        }
    };

    isValidBlockchain = async (req, res) => {  
        const isValid = await this.blockchain.isValid();
        req.logger.info(isValid);
        res.status(200).json(isValid);
    };

    addBlock = async (req, res) => {
        const data = req.body;        
        const block = await this.blockchain.addBlock(data);
        req.logger.info(block);
        res.status(200).json(block);
    };

    requestValidation = async (req, res) => {
        if(req.body.address) {
            const address = req.body.address;
            const message = await this.blockchain.requestValidation(address);
            req.logger.info(message);
            res.status(200).json(message);
        } else {
            return res.status(400).send("Check the Body Parameter!");
        }
    };

    addBlockSigned = async (req, res) => {
        if(req.body.address && req.body.message && req.body.signature && req.body.info) {
            const address = req.body.address;
            const message = req.body.message;
            const signature = req.body.signature;
            const info = req.body.info;

            const block = await this.blockchain.addBlockSigned(address, message, signature, info);
            req.logger.info(block);
            res.status(200).json(block);
        } 
        else {
            res.status(400).send("Check the Body Parameter!");
        }    
    };

    getBlockchanByOwner = async (req, res) => { 
        const owner = req.params.owner;     
        const blockData = await this.blockchain.getBlockchanByOwner(owner);
        req.logger.info(blockData);
        res.status(200).json(blockData); 
    };
}

module.exports = (app) => new BlockchainController(app);