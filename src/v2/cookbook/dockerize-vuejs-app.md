---
title: Dockerize Vue.js App
type: cookbook
order: 8
---

## Simple Example

So you built your first Vue.js app using the amazing [Vue.js webpack template](https://github.com/vuejs-templates/webpack) and now you really want to show off with your colleagues by demonstrating that you can also run it in a Docker container.

Let's start by creating a `Dockerfile` in the root folder of our project:

```docker
FROM node:9.11.1-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]
```

It may seem reduntant to first copy `package.json` and `package-lock.json` and then all project files and folders in two separate steps but there is actually [a very good reason for that](http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/) (spoiler: it allows us to take advantage of cached Docker layers).

Now let's build the Docker image of our Vue.js app:

```bash
docker build -t vuejs-cookbook/dockerize-vuejs-app .
```

Finally, let's run our Vue.js app in a Docker container:

```bash
docker run -it -p 8080:8080 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app
```

We should be able to access our Vue.js app on `localhost:8080`.

## Real-World Example

In the previous example, we used a simple, zero-configuration command-line [http server](https://github.com/indexzero/http-server) to serve our Vue.js app. Your colleagues are impressed but your boss is still shaking his head because we chose not to stand on the shoulders of some giant like [NGINX](https://www.nginx.com/) or [Apache](https://httpd.apache.org/). Now we are going to make it right.

Let's refactor our `Dockerfile` to use NGINX:

 ```docker
# build stage
FROM node:9.11.1-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Ok, let's see what's going on here:
* we have split our original `Dockerfile` in multiple stages by leveraging the Docker [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/) feature;
* the first stage is responsible for building a production-ready artifact of our Vue.js app;
* the second stage is responsible for serving such artifact using NGINX.

Now let's build the Docker image of our Vue.js app:

```bash
docker build -t vuejs-cookbook/dockerize-vuejs-app .
```

Finally, let's run our Vue.js app in a Docker container:

```bash
docker run -it -p 8080:80 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app
```

We should be able to access our Vue.js app on `localhost:8080`.
