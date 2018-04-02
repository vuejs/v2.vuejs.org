---
title: Dockerize Vue.js App
type: cookbook
order: 8
---

## Simple Example

So you built your first Vue.js app using the amazing [Vue.js webpack template](https://github.com/vuejs-templates/webpack) and now you really want to show off with your colleagues by demonstrating that you can also run it in a Docker container.

Let's start by creating a `Dockerfile` in the root folder of our project:

```docker
FROM node:9.8.0-alpine

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

Now let's build a Docker image for our Vue.js app:

```bash
docker build -t vuejs-cookbook/dockerize-vuejs-app .
```

Finally, let's run our Vue.js app in a Docker container:

```bash
docker run -it -p 8080:8080 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app
```

We should be able to access our Vue.js app on `localhost:8080`.
