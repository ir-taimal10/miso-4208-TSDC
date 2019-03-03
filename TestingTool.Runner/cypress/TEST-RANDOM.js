describe('Dashboard', function() {
    it('Process success creation basic the survey (name)', function() {
    	cy.visit('https://demo.limesurvey.org/index.php?r=admin/authentication/sa/login', { timeout: 30000 })
		cy.get('.login-submit').contains('login').click()

		cy.wait(1000);
        randomClick(5);            
	})
})

function randomClick(monkeysLeft) {

	function contains(arr, element) {
	    for (var i = 0; i < arr.length; i++) {
	        if (arr[i] === element) {
	            return true;
	        }
	    }
	    return false;
	}
    function getRandomIntHome(min, max) {
    	let arr = [3,4,5,6];
        min = Math.ceil(min);
        max = Math.floor(max);
        let result = Math.floor(Math.random() * (max - min)) + min;
        console.log("result:"+result);
        console.log("result-:"+contains(arr,result));
        if(contains(arr,result)===true){
        	return getRandomIntHome(min, max)
        }
        return result
    };

    function getRandomInt(min, max, ) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    function validatePullRight() {
    	cy.get('.pull-right').get('.dropdown').get('.dropdown-toggle').contains('demo').click();
        cy.get('.dropdown-menu li a').contains('Logout').should('be.visible')
    };

    function validateTitle() {
        //cy.get('.pagetitle').should('be.visible')
        cy.get('.pagetitle').should('be.visible').then($titles => {
        	if ($titles.length >0) {
				cy.get('.pagetitle').should('be.visible')
        	}
        });
    };

    function clickRandomButton() {
		cy.get('.full-page-wrapper').get('.btn.btn-default').should('not.be.disabled').then($buttons => {
			if($buttons.length > 0){
				var randombutton = $buttons.get(getRandomInt(0, $buttons.length));
				if(!Cypress.dom.isHidden(randombutton)) {	
				cy.wrap(randombutton).click();
				}
			} else {
			}
		});
    };

    function returnToHome() {
		cy.get('.navbar-header').get('.navbar-brand').click()
        cy.wait(1000)
    };

    var monkeysLeft = monkeysLeft;
    if(monkeysLeft > 0) {
    	{
            cy.get('.ls-panelboxes-panelbox').then($buttons => {
            	var randombutton = $buttons.get(getRandomIntHome(0, $buttons.length));
            	if(!Cypress.dom.isHidden(randombutton)) {
            		monkeysLeft = monkeysLeft - 1;
                	cy.wrap(randombutton).click();
                	validatePullRight()
                	validateTitle()
                	clickRandomButton()
                	cy.wait(1000);
                	returnToHome()
                	randomClick(monkeysLeft);   
                }
            });
			cy.wait(10);
            
        }
    }
}



