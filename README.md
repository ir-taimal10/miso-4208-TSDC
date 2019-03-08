# miso-4208-TSDC


[Wiki miso-4208-TSDC](https://github.com/ir-taimal10/miso-4208-TSDC/wiki)


Proyecto desarrollado para la aplicación de conocimientos aprendidos en la clase de 201910_MISO4208_01 - PRUEBAS AUTOMÁTICAS

Integrantes:
* Ivan Ricardo Taimal Narváez
* Fredy Gonzalo Captuayo Novoa




````angularjs
npm install 
````

La aplicacion tiene dos modos de funcionamiento, modo worker y modo server

El server es util para configurar las estrategias de prueba que se desean establecer sobre cada AUT.
## Server
````angularjs
npm run server 
````

````angularjs
npm run server:debug
````

Por su parte el Worker  está revisando los mensajes en la cola que indican que tipos de prueba deben aplicarse sobre cada AUT.
## Worker
````angularjs
npm run worker
````


Los tipos de prueba soportados hasta el momento se pueden ejecutar con las siguientes lineas:


## Tipos de pruebas para aplicaciones web
````angularjs
npm run test:cucumber
````
````angularjs
npm run test:puppeteer
````
````angularjs
npm run test:cypress
````
````angularjs
npm run worker
````



### Objeto a insertar en SQS
````angularjs
{
    "appType": "web",
    "domain": "http://34.220.148.114:8082/index.php",
    "tests": [
        "cucumber",
        "cypress",
        "puppeteer"
    ]
}
````



## Tipos de pruebas para aplicaciones moviles

````angularjs
emulator @Pixel_2_API_28
adb shell monkey -p org.isoron.uhabits -v 10000
````


### Objeto a insertar en SQS
````angularjs
{
    "appType": "mobile",
    "domain": "org.isoron.uhabits",
    "apkName": "unhabit.apk",
    "tests": [
        "adb_monkey"
    ]
}
````

