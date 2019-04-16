import * as AWS from "aws-sdk";
import {awsConfig} from "../Config/AWSConfig";
import {queueConfig} from "../Config/QueueConfig";

export class QueueService {
    private _sqs;

    constructor() {
        AWS.config.update(awsConfig);
        this._sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    }


    public async getTaskFromQueue() {
        let task = {};
        await this._sqs.receiveMessage(queueConfig, async (err, data) => {
            if (err) {
                console.log("Receive Error", err);
            } else {
                if (data && data.Messages) {
                    data.Messages.forEach(async (message, index) => {
                        await this.deleteTaskFromQueue(message.ReceiptHandle);
                        task = message.Body;
                    });
                } else {
                    console.log("No message to process");
                }
            }
        });
        return task;
    }

    public async deleteTaskFromQueue(receiptHandle) {
        const deleteParams = {
            QueueUrl: process.env.TSDC_SERVICES_QUEUE_URL,
            ReceiptHandle: receiptHandle
        };
        await this._sqs.deleteMessage(deleteParams, async (err, data) => {
            if (err) {
                console.log("Delete Error", err);
            }
        });
    }
}