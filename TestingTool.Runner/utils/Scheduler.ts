import * as Cron from "node-cron";
import {UtilsService} from "./UtilsService";

export class Scheduler {
    constructor() {
    }

    start(period: string) {
        console.log("Scheduler is running");
        Cron.schedule(period, async () => {
            const util = new UtilsService();
            await util.executeCommand(`npm run test`)
                .then(response => console.log("output", response));
            console.log("Test finished");
        });
    }

}