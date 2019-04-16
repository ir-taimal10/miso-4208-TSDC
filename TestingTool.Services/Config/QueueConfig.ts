export const queueConfig = {
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