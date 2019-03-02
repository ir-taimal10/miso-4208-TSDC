const path = require("path");
const outputFiles = path.join(__dirname, "reports", "puppeteer", "test-report_2.html");
module.exports = {
    verbose: true,
    preset: "jest-puppeteer",
    collectCoverage: false,
    "reporters": [
        "default",
        [
            path.join(__dirname, "node_modules", "jest-html-reporter"),
            {
                pageTitle: "Test with puppeteer",
                outputPath: outputFiles
            }
        ]
    ],

};

console.log('outputFiles', outputFiles);