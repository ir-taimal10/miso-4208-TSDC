import * as Cron from "node-cron";
import {UtilsService} from "./UtilsService";

export class Scheduler {
    constructor() {
    }

    start(period: string) {
        console.log("Scheduler is running");
        Cron.schedule(period, async () => {
            const util = new UtilsService();
            const platform = process.platform;
            let command = `cmd run test:e2e`;
            if (platform == 'win32') {
                command = `npm.cmd run test:e2e`;
            }
            await util.executeCommand(command)
                .then(response => console.log("output", response));
            console.log("Test finished", platform);
        });
    }

}