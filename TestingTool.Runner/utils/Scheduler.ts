import * as Cron from "node-cron";
import {TestRunner} from "./TestRunner";

export class Scheduler {
    constructor() {
    }

    async start(period: string) {
        if (
            process.env.TSDC_SERVICES_QUEUE_URL
            && process.env.TSDC_SERVICES_ACCESS_KEY_ID
            && process.env.TSDC_SERVICES_SECRET_KEY) {
            const testRunner = new TestRunner();
            console.log("┌───────────────┬───────────────┬──────────────────────┐");
            console.log("│   Running as Worker mode                             │");
            console.log("│   Reading Test Strategy from Queue                   │");
            console.log("└───────────────┴───────────────┴──────────────────────┘");
            Cron.schedule(period, async () => {
                console.log("┌───────────────┬───────────────┬──────────────────────┐");
                console.log("│   reload Scripts                                    │");
                await testRunner.downloadFile('login.test.ts');
                console.log("│   get Task From Queue                               │");
                await testRunner.getTaskFromQueue();
                console.log("└───────────────┴───────────────┴──────────────────────┘");
            });
        } else {
            console.log("┌───────────────┬───────────────┬──────────────────────┐");
            console.log("│   Worker is not running !!!                          │");
            console.log("│   Before to start the worker the next environment    │");
            console.log("│   vars must be configured:                           │");
            console.log("│                                                      │");
            console.log("│   TSDC_SERVICES_QUEUE_URL                            │");
            console.log("│   TSDC_SERVICES_ACCESS_KEY_ID                        │");
            console.log("│   TSDC_SERVICES_SECRET_KEY                           │");
            console.log("└───────────────┴───────────────┴──────────────────────┘");
        }
    }

}