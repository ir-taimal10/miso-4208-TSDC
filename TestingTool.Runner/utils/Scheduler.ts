import * as Cron from "node-cron";
import {TestRunner} from "./TestRunner";

export class Scheduler {
    constructor() {
    }

    start(period: string) {
        console.log("Scheduler is running");
        const testRunner = new TestRunner();
        Cron.schedule(period, async () => {
            await testRunner.getTaskFromQueue();
        });
    }

}