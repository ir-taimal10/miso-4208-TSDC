Feature: Login into limesurvey

# Scenario Outline: Login limesurvey with success inputs
#
#   Given I go to main page home screen 'http://34.216.245.75:8082/index.php/admin/authentication/sa/login'
#   When I write credentials <username> and <password>
#   And I click in submit login
#   Then I should view <result> as content
#   Then I close the browser
#   Examples:
#     | username | password    | result                                                                                      |
#     | admin    | password    | 'Esta es la interfaz de administración de LimeSurvey. Comience a elaborar su encuesta aquí' |
#     | admin    | passwordasa | 'Error'                                                                                     |

Scenario: Create success Survey in limesurvey with success inputs

  Given I go to main page home screen 'http://34.216.245.75:8082/index.php/admin/authentication/sa/login'
  When I write credentials admin and password
  And I click in submit login

  Then I should view 'Esta es la interfaz de administración de LimeSurvey. Comience a elaborar su encuesta aquí' as content
  When I click in panel with text 'Crear una nueva encuesta'
  Then I should view 'Crear, importar o copiar encuesta' as content
  When I fill input 'surveyls_title' with randomName
  When I click in link 'Guardar'
  Then I expect to see success creation survey

  When I go home
  Then I should view 'Esta es la interfaz de administración de LimeSurvey. Comience a elaborar su encuesta aquí' as content
  When I click in panel with text 'Crear una nueva encuesta'
  Then I should view 'Crear, importar o copiar encuesta' as content
  When I fill input 'surveyls_title' with randomName
  When I click in link 'Guardar'
  Then I expect to see success creation survey

  When I go home
  Then I should view 'Esta es la interfaz de administración de LimeSurvey. Comience a elaborar su encuesta aquí' as content
  When I click in panel with text 'Crear una nueva encuesta'
  Then I should view 'Crear, importar o copiar encuesta' as content
  When I fill input 'surveyls_title' with randomName
  When I click in link 'Guardar'
  Then I expect to see success creation survey

  When I go home
  Then I should view 'Esta es la interfaz de administración de LimeSurvey. Comience a elaborar su encuesta aquí' as content
  When I click in panel with text 'Crear una nueva encuesta'
  Then I should view 'Crear, importar o copiar encuesta' as content
  When I fill input 'surveyls_title' with randomName
  When I click in link 'Guardar'
  Then I expect to see success creation survey

  When I go home
  Then I should view 'Esta es la interfaz de administración de LimeSurvey. Comience a elaborar su encuesta aquí' as content
  When I click in panel with text 'Crear una nueva encuesta'
  Then I should view 'Crear, importar o copiar encuesta' as content
  When I fill input 'surveyls_title' with randomName
  When I click in link 'Guardar'
  Then I expect to see success creation survey

  Then I close the browser





