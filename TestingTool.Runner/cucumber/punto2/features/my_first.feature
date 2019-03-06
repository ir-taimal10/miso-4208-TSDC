Scenario: As a user I want to be able to open the help screen from the side menu the first time I open the app
   Given I press "Stations"
   #button to remove the splash screen
   When I swipe left
   #to open te menu
   And I press "Help"
   Then I should see "Calculate route with schedule"
