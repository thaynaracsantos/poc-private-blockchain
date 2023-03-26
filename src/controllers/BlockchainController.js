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
        this.app.post('/blockchain/owner/generate/keys', this.handleRequest(this.generateKeyPair)); 
        this.app.post('/blockchain/owner/generate/address', this.handleRequest(this.generateAddress)); 
        this.app.post('/blockchain/owner/generate/message', this.handleRequest(this.generateMessage)); 
        this.app.post('/blockchain/owner/sign/message', this.handleRequest(this.signMessage)); 
        this.app.post('/blockchain/block/signed', this.handleRequest(this.addBlockSigned)); 
        this.app.get('/blockchain/owner/:owner', this.handleRequest(this.getBlockchanByOwner));
    }

    getPing = async (req, res) => {        
        req.logger.info('Ping OK!');
        res.status(200).json('Pong!');
    };

    getLatestBlock = async (req, res) => {      
        const block = await this.blockchain.getLatestBlock();  
        req.logger.info({block});
        res.status(200).json({block});
    };

    getBlockByIndex = async (req, res) => {  
        const index = parseInt(req.params.index);    
        const block = await this.blockchain.getBlockByIndex(index);  
        if (block !== null) {
            req.logger.info({block});
            res.status(200).json({block});
        } else {
            res.status(404).json(`The block with index ${index} was not found.`);
        }
    };

    getBlockByHash = async (req, res) => {  
        const hash = req.params.hash;    
        const block = await this.blockchain.getBlockByHash(hash);  
        if (block !== null) {
            req.logger.info({block});
            res.status(200).json({block});
        } else {
            res.status(404).json(`The block with hash ${hash} was not found.`);
        }
    };

    isValidBlockchain = async (req, res) => {  
        const isValid = await this.blockchain.isValid();
        req.logger.info({isValid});
        res.status(200).json({isValid});
    };

    addBlock = async (req, res) => {
        const data = req.body;        
        const block = await this.blockchain.addBlock(data);
        req.logger.info({block});
        res.status(200).json({block});
    };

    generateKeyPair = async (req, res) => { 
        const publicKeyHex = await this.blockchain.generateKeyPairWithMPC();

        req.logger.info({publicKey: publicKeyHex});
        res.status(200).json({publicKey: publicKeyHex}); 
    };

    generateAddress = async (req, res) => {
        if(req.body.publicKey) {
            const publicKeyHex = req.body.publicKey;

            const address = await this.blockchain.generateAddress(publicKeyHex);
            req.logger.info({address});
            res.status(200).json({address});
        } 
        else {
            res.status(400).send("Check the Body Parameter!");
        }    
    };

    generateMessage = async (req, res) => {
        if(req.body.address) {
            const address = req.body.address;
            const message = await this.blockchain.generateMessage(address);
            req.logger.info({message});
            res.status(200).json({message});
        } else {
            return res.status(400).send("Check the Body Parameter!");
        }
    };

    signMessage = async (req, res) => {
        if(req.body.message) {
            const message = req.body.message;

            const signature = await this.blockchain.signMessageWithMPC(message)
            req.logger.info({signature});
            res.status(200).json({signature});
        } 
        else {
            res.status(400).send("Check the Body Parameter!");
        }    
    };

    addBlockSigned = async (req, res) => {
        if(req.body.address && req.body.message && req.body.signature && req.body.info) {
            const address = req.body.address;
            const message = req.body.message;
            const signature = req.body.signature;
            const info = req.body.info;

            const block = await this.blockchain.addBlockSigned(address, message, signature, info);
            req.logger.info({block});
            res.status(200).json({block});
        } 
        else {
            res.status(400).send("Check the Body Parameter!");
        }    
    };

    getBlockchanByOwner = async (req, res) => { 
        const owner = req.params.owner;     
        const blockchain = await this.blockchain.getBlockchanByOwner(owner);
        req.logger.info({blockchain});
        res.status(200).json({blockchain}); 
    };
}

module.exports = (app) => new BlockchainController(app);