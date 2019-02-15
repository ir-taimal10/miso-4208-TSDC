# miso-4208-TSDC


[Wiki miso-4208-TSDC](https://github.com/ir-taimal10/miso-4208-TSDC/wiki)


Proyecto desarrollado para la aplicación de conocimientos aprendidos en la clase de 201910_MISO4208_01 - PRUEBAS AUTOMÁTICAS

Integrantes:
* Ivan Ricardo Taimal Narváez
* Fredy Gonzalo Captuayo Novoa




````angularjs
npm install 
````

Al arrancar el proyecto  el server inicia un cron que ejecuta las pruebas cada minuto
dejando un reporte de resultados en la carpeta de archivos estaticos del servidor express, lo cual permite visualizar el reporte en 
http://localhost:8080/puppeteer/test-report.html.

````angularjs
npm run server 
````

````angularjs
npm run server:debug 
````