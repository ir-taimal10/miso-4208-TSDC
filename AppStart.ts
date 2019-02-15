import {ServerLoader, ServerSettings} from "@tsed/common";
import Path = require("path");
import {Scheduler} from "./TestingTool.Runner/utils/Scheduler";

@ServerSettings({
    rootDir: Path.resolve(__dirname),
    acceptMimes: ["application/json"],
    port: 8080,
    httpsPort: 8000,
    uploadDir: "${rootDir}/uploads",
    mount: {
        "/api": "${rootDir}/**/Controllers/**\/*Controller.ts"
    },
    statics: {
        "/": "${rootDir}/reports"
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
        //.use(GlobalAcceptMimesMiddleware)
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
        const scheduler = new Scheduler();
        scheduler.start("* * * * *");
    }

    public $onServerInitError(err) {
        console.error(err);
    }
}

new Server().start();