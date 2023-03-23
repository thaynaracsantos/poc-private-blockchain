const express = require('express')

class ApplicationServer {
    constructor() {
		this.app = express();
        
		this.initExpress();
        this.initControllers();
		this.start();
	}

    initExpress() {
		this.app.set('port', 3000);
	}

    initControllers() {
        require("./PingController.js")(this.app);
	}

    start() {
		let self = this;

        this.app.listen(this.app.get('port'), () => {
            console.log(`App listening on port ${this.app.get('port')}`)
        });
	}
}

new ApplicationServer();