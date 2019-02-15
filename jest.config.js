module.exports = {
    verbose: true,
    preset: "jest-puppeteer",
    collectCoverage: false,
    "reporters": [
        "default",
        ["./node_modules/jest-html-reporter", {
            pageTitle: "Test with puppeteer",
            outputPath: "./reports/puppeteer/test-report.html"
        }]
    ],

};