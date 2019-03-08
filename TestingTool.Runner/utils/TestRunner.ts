import * as AWS from 'aws-sdk';
import {UtilsService} from "./UtilsService";

export class TestRunner {
    private sqs: any;
    private params: any = {
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: process.env.TSDC_SERVICES_QUEUE_URL,
        VisibilityTimeout: 0,
        WaitTimeSeconds: 0
    };

    constructor() {
        AWS.config.update({
            accessKeyId: process.env.TSDC_SERVICES_ACCESS_KEY_ID,
            secretAccessKey: process.env.TSDC_SERVICES_SECRET_KEY,
            region: 'us-west-2'
        });
        this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    }

    async getTaskFromQueue() {
        await this.sqs.receiveMessage(this.params, async (err, data) => {
            if (err) {
                console.log("Receive Error", err);
            } else {
                if (data && data.Messages) {
                    data.Messages.forEach(async (message, index) => {
                        await this.deleteTaskFromQueue(message.ReceiptHandle);
                        await this.processTask(message.Body);
                    });
                } else {
                    console.log("No message to process");
                }
            }
        });
    }

    public async deleteTaskFromQueue(receiptHandle) {
        const deleteParams = {
            QueueUrl: process.env.TSDC_SERVICES_QUEUE_URL,
            ReceiptHandle: receiptHandle
        };
        await this.sqs.deleteMessage(deleteParams, async (err, data) => {
            if (err) {
                console.log("Delete Error", err);
            }
        });
    }

    async processTask(testTypes: string) {
        console.log("Test to execute: ", testTypes);
        const testsToRun = testTypes.split(',');
        testsToRun.forEach(async (test, index) => {
            await this.runTest(test);
        });
    }

    async runTest(test) {
        console.log("test", test);
        const util = new UtilsService();
        const platform = process.platform;
        let command = `npm run test:e2e`;
        if (platform == 'win32') {
            command = `npm.cmd run test:e2e`;
        }
        await util.executeCommand(command)
            .then(response => console.log("output", response));
        console.log("Test finished", platform);
    }
}