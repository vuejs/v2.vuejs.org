---
title: Dockerizar una aplicación Vue.js
type: cookbook
order: 13
---

## Ejemplo Simple

Así que creó su primer aplicación Vue.js usando la increíble [plantilla de Webpack Vue.js](https://github.com/vuejs-templates/webpack) y ahora realmente quiere presumir con sus colegas demostrando que también puede ejecutarlo en un contenedor Docker.

Comencemos creando un `Dockerfile` en la carpeta raíz de nuestro proyecto:

```docker
FROM node:9.11.1-alpine

# instalar un simple servidor http para servir nuestro contenido estático
RUN npm install -g http-server

# hacer la carpeta 'app' el directorio de trabajo actual
WORKDIR /app

# copiar 'package.json' y 'package-lock.json' (si están disponibles)
COPY package*.json ./

# instalar dependencias del proyecto
RUN npm install

# copiar los archivos y carpetas del proyecto al directorio de trabajo actual (es decir, la carpeta 'app')
COPY . .

# construir aplicación para producción minificada
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]
```

Puede parecer redundante copiar primero `package.json` y` package-lock.json` y luego todos los archivos y carpetas del proyecto en dos pasos separados, pero en realidad hay [una muy buena razón para eso](http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/) (adelanto: nos permite aprovechar las capas de Docker almacenadas en caché).

Ahora vamos a construir la imagen Docker de nuestra aplicación Vue.js:

```bash
docker build -t vuejs-cookbook/dockerize-vuejs-app .
```

Finalmente, ejecutamos nuestra aplicación Vue.js en un contenedor Docker:

```bash
docker run -it -p 8080:8080 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app
```

Deberíamos poder acceder a nuestra aplicación Vue.js en `localhost:8080`.

## Ejemplo de la vida real

En el ejemplo anterior, utilizamos una línea de comandos simple de cero configuración [servidor http](https://github.com/indexzero/http-server) para servir nuestra aplicación Vue.js que está perfectamente bien para la creación rápida de prototipos y _puede_ incluso estar bien para escenarios de producción simples. Después de todo, la documentación dice:

> Es lo suficientemente potente como para el uso en producción, pero es lo suficientemente simple como para ser utilizado para pruebas, desarrollo local y aprendizaje.

Sin embargo, para casos de uso de producción realmente complejos, puede ser más sabio considerar algún gigante como [NGINX](https://www.nginx.com/) o [Apache](https://httpd.apache.org/) y eso es exactamente lo que vamos a hacer a continuación: estamos a punto de aprovechar NGINX para servir nuestra aplicación Vue.js porque se considera que es una de las soluciones más eficaces y probadas en el campo de batalla.

Comencemos por modificar nuestro `Dockerfile` para usar NGINX:

 ```docker
# etapa de compilación
FROM node:9.11.1-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# etapa de producción
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Bien, veamos que está pasando aquí:
* hemos partido nuestro `Dockerfile` original en múltiples etapas mediante el aprovechamiento de la funcionalidad de Docker de [compilaciones multi-etapa](https://docs.docker.com/develop/develop-images/multistage-build/).
* la primera etapa es responsable de crear un artefacto de nuestra aplicación Vue.js listo para producción.
* la segunda etapa es responsable de servir tal artefacto utilizando NGINX.

Ahora vamos a construir la imagen Docker de nuestra aplicación Vue.js:

```bash
docker build -t vuejs-cookbook/dockerize-vuejs-app .
```

Finalmente, correremos nuestra aplicación Vue.js en un contenedor Docker:

```bash
docker run -it -p 8080:80 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app
```

Deberíamos ser capaces de acceder a nuestra aplicación Vue.js en `localhost:8080`.

## Contexto Adicional

Si estás leyendo este libro de cocina, es probable que ya sepa por qué decidió dockerizar su aplicación Vue.js. Pero si simplemente llegó a esta página después de presionar el botón `Me siento afortunado` de Google, déjeme compartir con usted un par de buenas razones para hacerlo.

La tendencia actual es construir aplicaciones usando el enfoque [Nativo de la Nube](https://pivotal.io/cloud-native), el cual gira principalmente alrededor de las siguientes palabras de moda:
* Micro-servicios
* DevOps
* Entrega Continua

Veamos cómo estos conceptos realmente afectan nuestra decisión de acoplar nuestra aplicación Vue.js.

### Efectos de los micro-servicios.

Al adoptar el [estilo arquitectónico de micro-servicios](https://martinfowler.com/microservices/), terminamos construyendo una sola aplicación como un conjunto de pequeños servicios, cada uno corriendo sus propios procesos y comunicándose a través de mecanismos livianos. Estos servicios son construidos al rededor de capacidades empresariales y desplegables de manera independiente mediante una maquinaria de implementación totalmente automatizada.

Por lo tanto, comprometerse con este enfoque arquitectónico la mayor parte del tiempo implica desarrollar y entregar nuestro front-end como un servicio independiente.

### Efectos de DevOps.

La adopción de la cultura [DevOps](https://martinfowler.com/bliki/DevOpsCulture.html), herramientas y practicas ágiles de ingeniería tienen, por sobre todas las cosas, el lindo efecto de incrementar la colaboración entre los roles de desarrollo y operaciones.
Uno de los principales problemas del pasado (pero también hoy en día en algunas realidades) es que el equipo de desarrollo no estaba interesado en la operación y el mantenimiento de un sistema una vez que se entregó al equipo de operaciones, mientras que este último no estaba realmente consciente de los objetivos de negocio, y por lo tanto, reacios a satisfacer las necesidades operativas del sistema (también denominados "caprichos de los desarrolladores").

Por lo tanto, entregar nuestra aplicación Vue.js como una imagen de Docker ayuda a reducir, si no eliminar por completo, la diferencia entre ejecutar el servicio en la computadora portátil de un desarrollador, el entorno de producción o cualquier otro entorno en el que podamos pensar.

### Efectos de entrega continua.

Al aprovechar la disciplina de [entrega continua](https://martinfowler.com/bliki/ContinuousDelivery.html) se construye software de tal forma que se puede potencialmente liberar en producción en cualquier momento. Dicha práctica de ingeniería se habilita por medio de lo que normalmente se llama [pipeline de entrega continua](https://martinfowler.com/bliki/DeploymentPipeline.html). El propósito del pipeline de entrega continua es dividir nuestra construcción en etapas (por ejemplo, compilación, pruebas unitarias, pruebas de integración, pruebas de rendimiento, etc.) y dejar que cada etapa verifique nuestro artefacto de compilación cada vez que cambie nuestro software. En última instancia, cada etapa aumenta nuestra confianza de que tan lista para producción se encuentra nuestra compilación y, por lo tanto, reduce el riesgo de romper cosas en producción (o cualquier otro entorno).

Por lo tanto, crear una imagen de Docker para nuestra aplicación Vue.js es una buena opción aquí porque representaría nuestro artefacto de construcción final, el mismo artefacto que se verificará contra nuestra entrega continua y que potencialmente podría liberarse a producción con confianza.

## Patrones Alternativos

Si su empresa aún no está interesada en Docker y Kubernetes o simplemente quiere sacar su MVP, tal vez no sea lo que necesite.

Alternativas comunes son:
* Aprovechar alguna plataforma de todo-en-uno como [Netlify](https://www.netlify.com/);
* Alojar su SPA en [Amazon S3](https://aws.amazon.com/s3/) y servirla con [Amazon CloudFront](https://aws.amazon.com/cloudfront/) (vea [este](https://serverless-stack.com/chapters/deploy-the-frontend.html) enlace para una guía detallada.
