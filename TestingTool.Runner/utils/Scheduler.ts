import * as Cron from "node-cron";
import {TestRunner} from "./TestRunner";

export class Scheduler {
    private status: "BUSY" | "IDLE" = "IDLE";

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
            await testRunner.runStrategy();
            Cron.schedule(period, async () => {
                if (this.status == "IDLE") {
                    this.status = "BUSY";
                    await testRunner.runStrategy();
                    this.status = "IDLE";
                }
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
