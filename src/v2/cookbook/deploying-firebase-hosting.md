---
title: Deploying Vue-Cli to Firebase Hosting
type: cookbook
order: 9
---

## Vue-Cli to Firebase Hosting

This is a verbose and entry level recipe to create a vue cli app and deploy it to [Firebase](firebase.google.com) hosting. Firebase is a very simple solution for hosting an app, and provides a number of features that are all managed in one console, including database, storage, messenging, cloud functions,  authentication, and a number of other common features that app builders usually need. 

Disadvantages of Firebase are that since a lot of work has been done for you, a lot of decisions have been made for you. They were mostly good decisions ... 



### Prerequisites
This recipe assumes you understand how Node and more specifically npm work. Well actually it just assumes you can google "How to install node and npm on my operating system".

You will need to go to Firebase and set up a project on the Firebase console. 

### The Meat

First use [vue-cli](https://www.npmjs.com/package/vue-cli) to make a new vue app. 
``` bash
npm install  -g vue-cli

vue init <template-name> <whatever-you-want-to-call-it>


```

Example:
``` bash 
yarn init webpack sf-needs-more-ways-to-get-pizza
```

Now install the Firebase SDK. 

``` bash
npm install firebase
```

Note, if you are planning on using other Firebase features, you will probably want to save the firebase sdk to your package.json like so...

``` bash
npm install firebase --save
``` 
So that you will be able to import that module when your app is run on Firebase. However if you are just using hosting, you don't need to do this. 

Ok, next let's tell Firebase what we want to do. 

``` bash 
firebase login
```

Allow Firebase to collect anonymous CLI usage and error reporting information? (Y/n) Y

``` bash

firebase init

```
Now you are going to be asked a series of questions. 
> bash
> _Which Firebase CLI features do you want to setup for this folder? 
> Press Space to select features, then Enter to confirm your choices. 
> 
> ◯ Database: Deploy Firebase Realtime Database Rules
> 
> ◯ Firestore: Deploy rules and create indexes for Firestore
> 
> ◯ Functions: Configure and deploy Cloud Functions
> 
> ◯ Hosting: Configure and deploy Firebase Hosting sites
> 
> ◯ Storage: Deploy Cloud Storage security rules_

 Use your arrow keys to select Hosting

 Then you will be asked to select a project or make a new one. 

 Note: Projects are free, however if you are planning on fetching from external apis, you will have to upgrade to a Spark plan, that is $25 per month.


> What do you want to use as your public directory? (public)

You are going to want to override this setting and set this to 
```  dist ```

> Configure as a single-page app ? 

Type y

> Re-write dist/index.html ?

Type N - this is the file that serves as the entry point for your vue app, so you are going to want to keep that. 


``` bash 
firebase deploy --only hosting
```
You can get away with just firebase deploy, but it's a good habit to get into to be explicit. 
If you encounter any problems, you may want to try adding the following 
``` bash
firebase deploy --only hosting --debug
```

This will give you much more verbose output, by default firebase deploy fails silently, which can be frustrating (trust me, I know)

At this point you let firebase work it's magic, and in a minute or two you should be given a link to follow for your brand spanking new Vue app in the cloud. Yay !



