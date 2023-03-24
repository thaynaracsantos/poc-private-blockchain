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
        this.app.get('/blockchain/block/data', this.handleRequest(this.getBlockData));
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

    getBlockData = async (req, res) => {       
        const blockData = await this.blockchain.getBlockData();
        req.logger.info(blockData);
        res.status(200).json(blockData);
    };
}

module.exports = (app) => new BlockchainController(app);