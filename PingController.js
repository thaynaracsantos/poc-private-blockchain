class PingController {
    constructor(app) {
        this.app = app;

        this.getPing();
    }

    getPing() {
        this.app.get('/ping', (req, res) => {
            return res.status(200).json('Pong!');
        });
    }
}

module.exports = (app) => { return new PingController(app);}  