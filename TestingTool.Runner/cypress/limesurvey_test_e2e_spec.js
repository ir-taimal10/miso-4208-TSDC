describe('Login', function() {
    
    it('Process the wrong login with other user', function() {
		const todaysDate = Cypress.moment().format('MM-DD-YYYY-')
    	cy.visit('https://demo.limesurvey.org/index.php?r=admin/authentication/sa/login', { timeout: 30000 })
		cy.screenshot( todaysDate + 'pre-login-001')
    	cy.get('.login-content').find('input[name="user"]').click().type("grupo5*********D++++d+d+d++d+d+d++d+d+d")
		cy.get('#notif-container')
		cy.screenshot( todaysDate + 'post-login-001')
    })

    it('Process the success Login with default user and logout', function() {
		const todaysDate = Cypress.moment().format('MM-DD-YYYY-')
    	cy.visit('https://demo.limesurvey.org/index.php?r=admin/authentication/sa/login', { timeout: 30000 })
		cy.screenshot( todaysDate + 'pre-login-002')
		cy.get('.login-submit').contains('login').click()
		cy.get('.pull-right').get('.dropdown').get('.dropdown-toggle').contains('admin').click();
		cy.get('.dropdown-menu li a').contains('Cerrar').click()
		cy.wait(5000)
		cy.screenshot( todaysDate + 'finished-002')
    })

})

describe('Create survey', function() {
    
    it('Process success creation basic the survey (name)', function() {
		const todaysDate = Cypress.moment().format('MM-DD-YYYY-')
		cy.visit('http://34.216.245.75:8082/index.php/admin/authentication/sa/login', { timeout: 30000 })
		cy.screenshot( todaysDate + 'pre-login-003')
		cy.get('.login-content').find('input[name="user"]').click().type("admin")
		cy.get('.login-content').find('input[name="password"]').click().type("password")
		cy.get('.login-submit').contains('login').click()
		cy.screenshot( todaysDate + 'post-login-003')
		cy.screenshot( todaysDate + 'pre-page-creation-003')
		cy.get('.selector__create_survey').click()
		cy.get('.form-group').find('input[name="surveyls_title"]').click().type("grupo5S-survey-asdsadsadsadsadasdsadsadasdasdasdasdasdasdasdsadsadasdasdasdasdasdasdasdasdasdasdasdasdasdsadasdasdasdasdasdasdasdasdasdasdasdasdasdsadasdassdasdasdasdasdasdasdasdsa")
		cy.screenshot( todaysDate + 'page-creation-003')
		cy.get('#save-form-button').click()
		cy.wait(5000)
		cy.get('#vue-side-body-app').get('.pagetitle').contains('grupo5S-survey (ID')
		cy.screenshot( todaysDate + 'page-detail-003')
		cy.get('.pull-right').get('.dropdown').get('.dropdown-toggle').contains('admin').click();
		cy.get('.dropdown-menu li a').contains('Cerrar').click()
		cy.wait(5000)
		cy.screenshot( todaysDate + 'finished-003')
        
    })

	it('Process success creation and delete the survey (name)', function() {
		const todaysDate = Cypress.moment().format('MM-DD-YYYY-')
		cy.visit('http://34.216.245.75:8082/index.php/admin/authentication/sa/login', { timeout: 30000 })
		cy.screenshot( todaysDate + 'pre-login-004')
		cy.get('.login-content').find('input[name="user"]').click().type("admin")
		cy.get('.login-content').find('input[name="password"]').click().type("password")
		cy.get('.login-submit').contains('login').click()
		cy.screenshot( todaysDate + 'post-login-004')
		cy.screenshot( todaysDate + 'pre-page-creation-004')
		cy.get('.selector__create_survey').click()
		cy.get('.form-group').find('input[name="surveyls_title"]').click().type("grupo5S-survey")
		cy.screenshot( todaysDate + 'page-creation-004')
		cy.get('#save-form-button').click()
		cy.wait(5000)
		cy.screenshot( todaysDate + 'page-detail-004')
		cy.get('#vue-side-body-app').get('.pagetitle').contains('grupo5S-survey (ID')
		cy.get('#surveybarid').get('#ls-tools-button').click()
		cy.screenshot( todaysDate + 'pre-delete-survey-004')
		cy.get('.dropdown-menu li a').contains('Eliminar encuesta').click()
		cy.wait(5000)
		cy.get('.message-box form').contains('Eliminar encuesta').click()
		cy.wait(5000)
		cy.get('#notif-container').get('.alert-success')
		cy.screenshot( todaysDate + 'pros-delete-survey-004')
		cy.wait(5000)
		cy.get('.pull-right').get('.dropdown').get('.dropdown-toggle').contains('admin').click();
		cy.get('.dropdown-menu li a').contains('Cerrar').click()
		cy.wait(5000)
		cy.screenshot( todaysDate + 'finished-004')
	})
})