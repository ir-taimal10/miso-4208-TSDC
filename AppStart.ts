import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import Path = require("path");
import "@tsed/multipartfiles";
import {Scheduler} from "./TestingTool.Runner/utils/Scheduler";
import "./TestingTool.Services/Middlewares/MultipartFilesOverrided";

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