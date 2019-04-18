import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import Path = require("path");
import "@tsed/multipartfiles";
import {Scheduler} from "./TestingTool.Runner/utils/Scheduler";
import "./TestingTool.Services/Middlewares/MultipartFilesOverrided";
import * as multerS3 from 'multer-s3';
import * as AWS from "aws-sdk";
import {awsConfig} from "./TestingTool.Services/Config/AWSConfig";

AWS.config.update(awsConfig);
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

@ServerSettings({
    rootDir: Path.resolve(__dirname),
    acceptMimes: ["application/json", "multipart/form-data"],
    port: process.env.PORT || 8080,
    uploadDir: "${rootDir}/uploads",
    mount: {
        "/api": "${rootDir}/**/Controllers/**\/*Controller.ts"
    },
    statics: {
        "/": Path.join(__dirname, "reports")
    },
    multer: {
        storage: multerS3({
            s3: s3,
            bucket: 'tsdcgrupo5',
            metadata: function (req, file, cb) {
                cb(null,
                    {
                        name: file.originalname,
                        fieldName: file.fieldname,
                        idStrategy: req.params.idStrategy,
                        testType: req.params.testType
                    }
                );
            },
            key: function (req, file, cb) {
                cb(null, `scriptTests/${req.params.idStrategy}/${req.params.testType}/${file.originalname}`)
            }
        })
    }
})
export class Server extends ServerLoader {
    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public $onMountingMiddlewares(): void | Promise<any> {
        const cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override');
        this
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }

    public $onReady() {
        console.log('Server started...');
        console.log('Statics ${rootDir}/reports');
        const args = process.argv;
        if (args.indexOf('--worker') > 0) {
            const scheduler = new Scheduler();
            scheduler.start("* * * * *");
        }
    }

    public $onServerInitError(err) {
        console.error(err);
    }
}

new Server().start();