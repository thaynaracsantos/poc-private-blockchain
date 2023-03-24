const express = require('express')
const winston = require("winston");
const morgan = require('morgan');

class ApplicationServer {
    constructor() {  
		this.initExpress();
        this.initLogMiddleWare();        
        this.initControllers();
        this.initErrorMiddleware();
		this.start();
	}

    initExpress = () => {
        this.app = express();     
        this.port = process.env.PORT || 3000;

        this.app.use(express.json());
	}

    initLogMiddleWare = () => {
        const loggerConfig = {
            level: 'info',
            format: winston.format.json(),
            transports: [new winston.transports.Console()],
        };

        this.logger = winston.createLogger(loggerConfig);

        this.app.use(
            morgan('combined', {
              stream: { write: message => this.logger.info(message.trimEnd()) },
            })
        );

        this.app.use((req, res, next) => {
            req.logger = this.logger;
            next();
        });
	}
    
    initControllers = () => {
        require("./src/controllers/PingController.js")(this.app);
        require("./src/controllers/BlockchainController.js")(this.app);
    }

    initErrorMiddleware = () => {
        this.app.use((err, req, res, next) => {
            req.logger.error({message: err.message, stackTrace: err.stack});
            res.status(500).send('Internal server error');
        });
    };

    start = () => {
        try {
            this.app.listen(this.port, () => {
                this.logger.info(`App listening on port ${this.port}`);
            });
        } catch (error) {
            this.logger.error(error);
            process.exit(1);
        }
	}
}

new ApplicationServer();