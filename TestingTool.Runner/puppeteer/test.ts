declare var page: any;
declare var document: any;

describe('Form in normal state', () => {
    beforeAll(async () => {
        await page.goto('https://angular-6-registration-login-example.stackblitz.io/register');
    });

    it('Form should load without error', async () => {
        await expect(await page.waitForSelector(".container h2"));
        const text = await page.evaluate(() => document.body.textContent);
        expect(text).toContain('Register');
        expect(text).toContain('Angular 6 User Registration and Login Example & Tutorial');
        await page.screenshot({path: './screenshot.png'});
    });

    it('Form should have a title', async () => {
        await expect(page.title()).resolves.toMatch('');
        await expect(await page.waitForSelector(".container h2"));
    });

    it('Form should have a firstName field', async () => {
        await expect(await page.waitForSelector(".container input[ng-reflect-name='firstName']"));
    });

    it('Form should have a lastName field', async () => {
        await expect(await page.waitForSelector(".container input[ng-reflect-name='lastName']"));
    });
    it('Form should have a username field', async () => {
        await expect(await page.waitForSelector(".container input[ng-reflect-name='username']"));
    });
    it('Form should have a password field', async () => {
        await expect(await page.waitForSelector(".container input[ng-reflect-name='password']"));
    });

    it('Form should have a ok button field', async () => {
        await expect(await page.waitForSelector(".container .btn-primary"));
    });

    it('Form should have a Cancel button field', async () => {
        await expect(await page.waitForSelector(".container .btn-link"));
    });

    it('Form should show Registration successful', async () => {
        await page.type(".container input[ng-reflect-name='firstName']", "rafael");
        await page.type(".container input[ng-reflect-name='lastName']", "eduardo");
        await page.type(".container input[ng-reflect-name='username']", "admin");
        await page.type(".container input[ng-reflect-name='password']", "admin123");
        await page.click(".container .btn-primary");
        await expect(await page.waitForSelector(".container .alert-success"));
        const result = await page.evaluate(() => document.querySelector('.container .alert-success').innerHTML);
        expect(result).toBe('Registration successful');
    });


    it('Form should show Login successful', async () => {
        await page.type(".container input[ng-reflect-name='username']", "admin");
        await page.type(".container input[ng-reflect-name='password']", "admin123");
        await page.click(".container .btn-primary");
        await expect(await page.waitForSelector(".container h1"));
        await expect(await page.waitForSelector(".container h3"));
        await expect(await page.waitForSelector(".container p"));
        const result = await page.evaluate(() => document.querySelector('.container h1').innerHTML);
        expect(result).toBe('Hi rafael!');
        await page.goto('https://angular-6-registration-login-example.stackblitz.io/register');
    });

});