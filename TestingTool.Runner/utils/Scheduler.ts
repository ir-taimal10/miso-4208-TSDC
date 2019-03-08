import * as Cron from "node-cron";
import {TestRunner} from "./TestRunner";

export class Scheduler {
    constructor() {
    }

    start(period: string) {

        console.log("┌───────────────┬───────────────┬──────────────────────┐");
        console.log("│   Running as Worker mode                             │");
        console.log("│   Reading Test Strategy from Queue                   │");
        console.log("└───────────────┴───────────────┴──────────────────────┘");

        const testRunner = new TestRunner();
        Cron.schedule(period, async () => {
            await testRunner.getTaskFromQueue();
        });
    }

}