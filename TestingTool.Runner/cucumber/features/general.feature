Feature: Login into limesurvey

Scenario Outline: Login limesurvey with success inputs

  Given I go to main page home screen
    When I fill with success <username> and <password>
    And I try to login
    Then I expect to see success

    Examples:
      | username         | password            |
      | admin            | password            |


Scenario Outline: Create success Survey in limesurvey with success inputs

  Given I go to main page home screen
    When I fill with success <username> and <password>
    And I try to login
    And I click in funtion create survey
    And I fill survey with success <namesurvey>
    And I try to create survey
    Then I expect to see success creation survey <error>

    Examples:
      | username         | password            | namesurvey                         |
      | admin            | password            |    demo                            |
      | admin            | password            |    dedasdsadasdasdsamo             |  
      
      
Scenario Outline: Login limesurvey with wrong inputs

  Given I go to main page home screen
    When I fill with wrong <username> and <password>
    And I try to login
    Then I expect to see <error>

    Examples:
      | username         | password            | error                                  |
      | miso             |    1234             | Incorrect username and/or password!    |
      | miso             |    select * from 1  | Incorrect username and/or password!    |
