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
        let self = this;
        return new Promise(function (resolve, reject) {
            let tasks = [];
            self._sqs.receiveMessage(queueConfig, async (err, data) => {
                if (err) {
                    console.log("Receive Error", err);
                    reject();
                } else {
                    if (data && data.Messages) {
                        data.Messages.forEach(async (message, index) => {
                            await self.deleteTaskFromQueue(message.ReceiptHandle);
                            tasks.push(message.Body);
                        });
                        resolve(tasks);
                    } else {
                        console.log("│   No message to process ...                           │");
                        resolve({});
                    }
                }
            });
        })
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


    public async pushTaskToQueue(message) {
        const params = {
            DelaySeconds: 10,
            QueueUrl: queueConfig.QueueUrl,
            MessageBody: "Voice to process"
        };
        params.MessageBody = message;
        await this._sqs.sendMessage(params, function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("pushTaskToQueue : OK", data.MessageId);
            }
        });

    };
}