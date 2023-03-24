const BaseController = require('./BaseController.js');

class PingController extends BaseController {
    constructor(app) {
        super();
        this.app = app;

        this.app.get('/ping', this.handleRequest(this.getPing));
    }

    getPing = async (req, res) => {        
        req.logger.info('Ping OK!');
        res.status(200).json('Pong!');
    };
}

module.exports = (app) => new PingController(app);