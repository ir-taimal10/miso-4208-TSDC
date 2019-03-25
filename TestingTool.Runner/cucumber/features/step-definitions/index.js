const {Given, When, Then, After} = require('cucumber');
const {expect} = require('chai');
const puppeteer = require('puppeteer');
const select = require('puppeteer-select');

const faker = require('faker');

global.testContext = global.testContext || {};
const timeOut = {timeout: 20 * 1000};





After(async ()=> {
    console.log("after -------------");
    this.attach('{"name": "some JSON"}', 'application/json');
});

Given('I go to main page home screen {string}', timeOut, async (url) => {
    const width = 1280;
    const height = 1200;
    global.testContext.screenshotPath = `${new Date().getTime()}`;
    global.testContext.browser = await puppeteer.launch({
        headless: false,
        launch: {},
        browserContext: 'default',
        exitOnPageError: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            `--window-size=${width},${height}`
        ]
    });
    global.testContext.page = await global.global.testContext.browser.newPage();

    await global.testContext.page.setViewport({
        width: width,
        height: height
    });
    await global.testContext.page.goto(url);
});


When(/^I write credentials (.*) and (.*)$/, timeOut, async (username, password) => {
    await expect(await global.testContext.page.waitForSelector(".login-panel"));
    await global.testContext.page.type('.login-panel input[name="user"]', username);
    await global.testContext.page.type('.login-panel input[name="password"]', password);
});

When('I click in submit login', async () => {
    await expect(await global.testContext.page.waitForSelector(".login-panel"));
    await global.testContext.page.click('button[name="login_submit"]');
});

Then('I should view {string} as content',
    {timeout: 20 * 1000}, async (content) => {
        await global.testContext.page.waitForSelector("body");
        expect(await select(global.testContext.page).getElement(`p:contains(${content})`));
    });

When('I click in panel with text {string}',
    timeOut, async (textToClick) => {
        await global.testContext.page.waitForSelector("body");
        const element = await select(global.testContext.page).getElement(`.panel-clickable div:contains(${textToClick})`);

        if (element && element.click) {
            await element.click();
        }
    });

When('I click in link {string}',
    timeOut, async (textToClick) => {
        await global.testContext.page.waitForSelector("body");
        const element = await select(global.testContext.page).getElement(`a:contains(${textToClick})`);
        if (element && element.click) {
            await element.click();
        }
    });

When('I go home', timeOut, async () => {
    await global.testContext.page.waitForSelector("body");
    const element = await select(global.testContext.page).getElement(`.navbar-brand:contains("LimeSurvey")`);

    if (element && element.click) {
        await element.click();
    }
});

Then('I close the browser',
    timeOut, async () => {
        await global.testContext.page.waitForSelector("body");
        await global.testContext.browser.close();
    });


When('I fill input {string} with {string}', timeOut, async (inputId, data) => {
    const selector = 'input[name="' + inputId + '"]';
    await global.testContext.page.waitForSelector("body");
    await expect(await global.testContext.page.waitForSelector(selector));
    await global.testContext.page.type(selector, data);
});


When('I fill input {string} with randomName', timeOut, async (inputId) => {
    const selector = 'input[name="' + inputId + '"]';
    await global.testContext.page.waitForSelector("body");
    await expect(await global.testContext.page.waitForSelector(selector));
    await global.testContext.page.type(selector, faker.name.title());
});

Then('I expect to see success creation survey', timeOut, async () => {
    await global.testContext.page.waitForSelector("body");
    await expect(await global.testContext.page.waitForSelector(".alert-dismissible"));
});


