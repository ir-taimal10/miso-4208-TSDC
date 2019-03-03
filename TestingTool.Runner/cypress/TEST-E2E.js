describe('Login', function() {
    
    it('Process the wrong login with other user', function() {
    	cy.visit('https://demo.limesurvey.org/index.php?r=admin/authentication/sa/login', { timeout: 30000 })
    	cy.get('.login-content').find('input[name="user"]').click().type("grupo5*********D++++d+d+d++d+d+d++d+d+d")
		cy.get('.login-submit').contains('login').click()
		cy.get('#notif-container')
    })

    it('Process the success Login with default user and logout', function() {
    	cy.visit('https://demo.limesurvey.org/index.php?r=admin/authentication/sa/login', { timeout: 30000 })
		cy.get('.login-submit').contains('login').click() 
		cy.get('.pull-right').get('.dropdown').get('.dropdown-toggle').contains('demo').click();
        cy.get('.dropdown-menu li a').contains('Logout').click()
        cy.get('.login-submit').contains('login')
    })

})

describe('Create survey', function() {
    
    it('Process success creation basic the survey (name)', function() {
    	cy.visit('https://demo.limesurvey.org/index.php?r=admin/authentication/sa/login', { timeout: 30000 })
		cy.get('.login-submit').contains('login').click()
		cy.get('.selector__create_survey').click() 
		cy.get('.form-group').find('input[name="surveyls_title"]').click().type("grupo5S-survey-asdsadsadsadsadasdsadsadasdasdasdasdasdasdasdsadsadasdasdasdasdasdasdasdasdasdasdasdasdasdsadasdasdasdasdasdasdasdasdasdasdasdasdasdsadasdassdasdasdasdasdasdasdasdsa")
		cy.get('#save-form-button').click()
		cy.wait(5000)
		cy.get('#vue-side-body-app').get('.pagetitle').contains('grupo5S-survey (ID')
		cy.get('.pull-right').get('.dropdown').get('.dropdown-toggle').contains('demo').click();
        cy.get('.dropdown-menu li a').contains('Logout').click()
        cy.get('.login-submit').contains('login')
        
    })

    it('Process success creation and delete the survey (name)', function() {
    	cy.visit('https://demo.limesurvey.org/index.php?r=admin/authentication/sa/login', { timeout: 30000 })
		cy.get('.login-submit').contains('login').click()
		cy.get('.selector__create_survey').click() 
		cy.get('.form-group').find('input[name="surveyls_title"]').click().type("grupo5S-survey")
		cy.get('#save-form-button').click()
		cy.wait(5000)
		cy.get('#vue-side-body-app').get('.pagetitle').contains('grupo5S-survey (ID')
		cy.get('#surveybarid').get('#ls-tools-button').click()
		cy.get('.dropdown-menu li a').contains('Delete survey').click()
		cy.wait(5000)
		cy.get('.message-box form').contains('Delete survey').click()
		cy.wait(5000)
		cy.get('#notif-container').get('.alert-success')
		cy.wait(5000)
		cy.get('.pull-right').get('.dropdown').get('.dropdown-toggle').contains('demo').click();
        cy.get('.dropdown-menu li a').contains('Logout').click()
        cy.get('.login-submit').contains('login')
    })
})