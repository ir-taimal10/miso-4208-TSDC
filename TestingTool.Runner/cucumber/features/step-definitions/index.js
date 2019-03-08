var {defineSupportCode} = require('cucumber');
var {expect} = require('chai');

defineSupportCode(({Given, When, Then}) => {
  Given('I go to main page home screen', () => {
    browser.url('/admin/authentication/sa/login');
  });

  When(/^I fill with wrong (.*) and (.*)$/ , (username, password) => {
    
    var loginPanel = browser.element('.login-panel');

    var userInput = loginPanel.element('input[name="user"]');
    userInput.click();
    userInput.keys(username);

    var passwordInput = loginPanel.element('input[name="password"]');
    passwordInput.click();
    passwordInput.keys(password)

  });

  When('I try to login', () => {
    
    var loginPanel = browser.element('.login-panel');
    
    loginPanel.element('button=Log in').click();

  });

  Then('I expect to see {string}', error => {
    browser.waitForVisible('.alert-dismissible', 15000);
    var alertText = browser.element('.alert-dismissible').getText();
    expect(alertText).to.include(error);
  });


  When(/^I fill with success (.*) and (.*)$/ , (username, password) => {
    
    browser.waitForVisible('.login-panel', 20000);

    var loginPanel = browser.element('.login-panel');

    var userInput = loginPanel.element('input[name="user"]');
    userInput.click();
    userInput.keys(username);

    var passwordInput = loginPanel.element('input[name="password"]');
    passwordInput.click();
    passwordInput.keys(password)

  });  

  When('I click in funtion create survey', () => {
    browser.element('.selector__create_survey').click();
  });

  When(/^I fill survey with success (.*)$/ , (namesurvey) => {
    
    var formPanel = browser.element('.form-group');

    var nameInput = formPanel.element('input[name="surveyls_title"]');
    nameInput.click();
    nameInput.keys(namesurvey);

  });

  When('I try to create survey', () => {
    browser.element('#save-form-button').click();
    browser.waitForVisible('.alert-info', 15000);
  });

  Then('I expect to see success creation survey',() => {
     browser.waitForVisible('.alert-dismissible', 15000);
  });

});
