---
title: Building Desktop Apps with Electron and Vue
type: cookbook
order: 13
---

What if you could build a cross platform desktop app with Vue? You can with Electron.

[Electron](https://electronjs.org/) enables developers to use web technologies to build cross platform desktop apps. It accomplishes this by ["combining Chromium and Node into a single runtime and apps can be packaged for Mac, Windows, and Linux"](https://electronjs.org/docs/tutorial/about#about-electron). This enables us to use Vue for building
the UI of a desktop app and gives us access to Node and Electron APIs within our apps.

Let's get started and we'll explain more things as we go.

## Getting Started

First, you'll need to install `vue-cli`.

```
$ npm install -g vue-cli
```

Next, we're going to set up our project with a pre-existing Electron + Vue template.

```
$ vue init simulatedgreg/electron-vue timer
```

**Please read this whole paragraph before proceeding.** During the set up process, you'll be asked a series of questions to help you set up. When asked which Vue plugins to install; please choose `vue-electron` (we won't need the other options). You'll also be asked which build tool you would like to use; please choose `electron-builder`. We won't need anything else so if you're asked about ESLint or testing, you can say no to those (but you may want to use them in future projects).

The `vue-electron` plugin makes Electron's APIs available for use within our Vue components. We'll use `electron-builder` to package our application into executables for Windows, Mac, and Linux.

To install all necessary dependencies, navigate to your `timer/` folder (`cd timer/`) then run:

```
$ npm install
```

Launch the Electron + Vue starter template by running:

```
$ npm run dev
```

Upon launch, you should be greeted with the following:

![Electron + Vue Starter Template](https://i.imgur.com/PUkidUw.png)

We'll be writing Vue code in the `src/renderer/` folder. Note that there are two folders within the `src/` folder: `main` and `renderer`.

Electron apps run two types of processes: main and renderer. The renderer processes are responsible for rendering the webpages (the user interface) and the main process is responsible for everything else such as managing the renderer processes, setting the window size, and setting the window's menu options. Both processes correspond to the code written in each of their respective folders. Since we'll be writing Vue code in the `renderer/` folder, our Vue instances will be running on a renderer process.

Node and [Electron APIs](https://electronjs.org/docs/api) are accessible from the renderer processes. Imagine a browser with access to operating system APIs and you've got an Electron application. In this tutorial, we'll be working mostly inside the `src/renderer/` folder.

You can read more about [the main and renderer processes at Electron's documentation](https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes).

## Base Example

Let's start by building a simple timer in Vue. Checkout the `src/renderer/` folder's contents. The directory structure is similar to the directory structure of projects using Vue's [Single File Components](https://vuejs.org/v2/guide/single-file-components.html).

Remove the `src/renderer/components/` folder and it's contents.

Replace the `App.vue`'s contents with the following:

```vue
<template>
<div>
  <h1>{{minutes}}:{{seconds}}</h1>
</div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      minutes: 1,
      seconds: 0
    };
  }
};
</script>
```

You should see the below:

![Screenshot](https://i.imgur.com/rlQiEST.png)

Our timer looks weird because the minutes and seconds are single digits. We can fix this by adding a computed property that adds zero padding to the minutes and seconds. Make the changes indicated in the comments below.

```vue
<template>
<div>
  <!-- note the change below -->
  <h1>{{minutesText}}:{{secondsText}}</h1>
</div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      minutes: 1,
      seconds: 0
    };
  },
  // add the computed properties
  computed: {
    minutesText() {
      return String(this.minutes).padStart(2, "0");
    },
    secondsText() {
      return String(this.seconds).padStart(2, "0");
    }
  }
};
</script>
```

Now our timer looks better.

![Screenshot](https://i.imgur.com/0kKhtVp.png)

Next, let's add a start and reset button for our timer. Make the changes indicated in the comments below.

```vue
<template>
<div>
  <h1>{{minutesText}}:{{secondsText}}</h1>

  <!--add the buttons below-->
  <button @click="startTimer">Start</button>
  <button @click="resetTimer">Reset</button>
</div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      minutes: 1,
      seconds: 0,
      // add the timer variable
      timer: null
    };
  },
  // add the methods
  methods: {
    startTimer() {
      this.timer = setInterval(() => this.countdown(), 1000);
    },
    resetTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.minutes = 1;
      this.seconds = 0;
    },
    countdown() {
      this.seconds--;
      if (this.seconds < 0) {
        this.minutes--;
        if (this.minutes < 0) {
          this.resetTimer();
        } else {
          this.seconds = 59;
        }
      }
    }
  },
  computed: {
    minutesText() {
      return String(this.minutes).padStart(2, "0");
    },
    secondsText() {
      return String(this.seconds).padStart(2, "0");
    }
  }
};
</script>
```

Now you should be able to start and reset the timer. You might notice the timer counts down faster when you click Start several times while the timer is already running. To avoid this from happening, let's disable the Start button when the timer is already running. We'll add a variable called `running` which will represent the state of the timer and use that variable to disable the Start button while the timer is running. Make the necessary changes indicated in the comments below.

```vue
<template>
<div>
  
  <h1>{{minutesText}}:{{secondsText}}</h1>

  <!--Use the running variable to disable buttons-->
  <button @click="startTimer" :disabled="running">Start</button>
  <button @click="resetTimer" :disabled="!running">Reset</button>

</div>    
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      minutes: 1,
      seconds: 0,
      timer: null,
      running: false
    };
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => this.countdown(), 1000);

      // flip the running variable to true
      this.running = true;
    },
    resetTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.minutes = 1;
      this.seconds = 0;

      // flip the running variable to false
      this.running = false;
    },
    countdown() {
      this.seconds--;
      if (this.seconds < 0) {
        this.minutes--;
        if (this.minutes < 0) {
          this.resetTimer();
        } else {
          this.seconds = 59;
        }
      }
    }
  },
  computed: {
    minutesText() {
      return String(this.minutes).padStart(2, "0");
    },
    secondsText() {
      return String(this.seconds).padStart(2, "0");
    }
  }
};
</script>

<style>
</style>
```

Next, let's add buttons for setting the timer's default value. We'll need to add variables for the default minutes and seconds too. When we click the Reset button, our timer will set itself to the default minutes and seconds variables. Make the changes indicated in the comments below.

```vue<template>
<div>

  <h1>{{minutesText}}:{{secondsText}}</h1>

  <button @click="startTimer" :disabled="running">Start</button>
  <button @click="resetTimer" :disabled="!running">Reset</button>

  <!--Add buttons to manipulate the timer, disabled while the timer is running-->
  <button @click="increment" :disabled="running">+</button>
  <button @click="decrement" :disabled="running">-</button>

</div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      minutes: 1,
      seconds: 0,
      timer: null,
      running: false,

      // add the default minutes and seconds
      defaultMinutes: 1,
      defaultSeconds: 0
    };
  },
  methods: {
    startTimer() {
      // set the default minutes and seconds when the user clicks start
      this.defaultMinutes = this.minutes;
      this.defaultSeconds = this.seconds;

      this.timer = setInterval(() => this.countdown(), 1000);
      this.running = true;
    },
    resetTimer() {
      clearInterval(this.timer);
      this.timer = null;
      // Remove the following lines in the comment below
      /*
      this.minutes = 1;
      this.seconds = 0;
      */
      this.running = false;

      // reset the timer to the default minutes and seconds
      this.minutes = this.defaultMinutes;
      this.seconds = this.defaultSeconds;
    },
    countdown() {
      this.seconds--;
      if (this.seconds < 0) {
        this.minutes--;
        if (this.minutes < 0) {
          this.resetTimer();
        } else {
          this.seconds = 59;
        }
      }
    },
    // add these two methods
    increment() {
      this.minutes++;
    },
    decrement() {
      if (this.minutes > 1) {
        this.minutes--;
      }
    }
  },
  computed: {
    minutesText() {
      return String(this.minutes).padStart(2, "0");
    },
    secondsText() {
      return String(this.seconds).padStart(2, "0");
    }
  }
};
</script>
```

Your app should like this:
![Screenshot](https://i.imgur.com/Fem2c3Z.png)

We've built a desktop app for a timer with Electron and Vue. But it doesn't use desktop-only features like reading/writing to files or sending desktop notifications. We also haven't made an executable for our desktop app; it only runs when we run `npm run dev`. In the next section we'll incorporate desktop-only features. We'll build an executable for our app when we are done building the app's functionalities.

## Real-World Example

We've built a desktop app for a timer with Electron and Vue but we haven't used desktop-only features. In this section, we'll use APIs from Node and Electron to bring desktop features. We'll use the `os` and `fs` modules from Node to read/write to files and HTML5 notifications from Electron to send desktop notifications.

> HTML5 notifications come from Chromium but Electron tweaks the HTML5 notification API to send desktop notifications instead of in-browser notifications

### Save the users' default timer

We'll use Node's `os` and `fs` modules to read and write to a file on the user's computer so we can load the previous timer's settings when the user loads the application.

First, we'll need to import Node's `os` and `fs` modules.

```javascript
<script>
import os from "os";
import fs from "fs";

// exporting Vue instance below
....
```

We'll save the user's settings in a file called `.vue_electron_timer` which will be located in the user's home directory. The user's home directory path is different for Linux, MacOS, and Windows so we use the `homedir()` from Node's `os` module to get the home directory across all platforms.

On Windows, the home directory is usually `C:\Users\your_username`.
On MacOS, the home directory is usually `/Users/your_username`.
On Linux, the home directory is usually `~` or `/home/your_username`.

Create a variable that contains the path to our settings file.

```
<script>
import os from "os";
import fs from "fs";

// add the below
const path_to_settings = `${os.homedir()}/.vue_electron_timer`;

// exporting Vue instance below
....
```

We'll use `path_to_settings` to read and write to the timer's settings file.

Whenever the user clicks Start, we'll save their timer's start time. For example, if the user sets their timer to 5:00 and clicks start, then we'll save 5 minutes and 0 seconds to the timer's save file so the next time the user opens the application, they'll start with a timer set to 5:00.

We can save the user's start time by using the [writeFile](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback) function from Node's `fs` module to write to a file.

Let's make the following addition to the `startTimer` method:

```javascript
startTimer() {
  this.defaultMinutes = this.minutes;
  this.defaultSeconds = this.seconds;

  // Make the following addition
  fs.writeFile(
    path_to_settings,
    `${this.defaultMinutes}:${this.defaultSeconds}`,
    err => {
      if (err) {
        return console.log("Failed to save default values");
      }
      console.log(
        `Saved ${this.defaultMinutes}:${this.defaultSeconds} as default`
      );
    }
  );

  this.timer = setInterval(() => this.countdown(), 1000);
  this.running = true;
},
```

When the Vue instance is [mounted](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram), we'll load the default values from the file then load the values into the right variables to be used by our app.

We can use the [existsSync](https://nodejs.org/api/fs.html#fs_fs_existssync_path) function from Node's `fs` module to check if a file exists. If it exists, then we'll load the data from the save file by using [readFileSync](https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options). If the file doesn't exist, then the user is opening our application for the first time and nothing needs to be done (the timer's default value will be based on the initial values in the Vue instance's `data()` function). Add the following `mounted` function to the Vue component.

```javascript
....
export default {
  name: "App",
  // add the below
  mounted() {
    if (fs.existsSync(path_to_settings)) {
      let data = fs.readFileSync(path_to_settings);
      let defaultTime = data.toString();
      this.defaultMinutes = defaultTime.split(":")[0];
      this.defaultSeconds = defaultTime.split(":")[1];
      this.minutes = this.defaultMinutes;
      this.seconds = this.defaultSeconds;
    }
  },
  data() {...
```

> Checkout the Vue [Lifecycle Diagram](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram) to see when a Vue instance is mounted.

Test your timer. Set it to 12:00, click start, close the app, run `npm run dev`, and your timer should be set to 12:00 by default.

### Add desktop notifications

Here's how we create a HTML5 notification:

```javascript
new Notification("Title of notification", {
  body: "And a longer subtitle for the notification"
});
```

Whenever the timer hits zero (0:00) we'll send a notification. Let's add a notification to our `App.vue`'s `countdown` method.

```javascript
....
countdown() {
  this.seconds--;
  if (this.seconds < 0) {
    this.minutes--;
    if (this.minutes < 0) {

      // add the below notification 
      new Notification("Time's Up!", {
        body: "Woo hoo! A desktop notification!"
      });

      this.resetTimer();
    } else {
      this.seconds = 59;
    }
  }
}
....
```

Test out your timer. When your timer hits zero, you should get a desktop notification.

Your `App.vue` file should look like the following:
```vue
<template>
<div>
  <h1>{{minutesText}}:{{secondsText}}</h1>
  <button @click="startTimer" :disabled="running">Start</button>
  <button @click="resetTimer" :disabled="!running">Reset</button>
  <button @click="increment" :disabled="running">+</button>
  <button @click="decrement" :disabled="running">-</button>
</div>
</template>
<script>
import os from "os";
import fs from "fs";

const path_to_settings = `${os.homedir()}/.vue_electron_timer`;

export default {
  name: "App",
  mounted() {
    if (fs.existsSync(path_to_settings)) {
      let data = fs.readFileSync(path_to_settings);
      let defaultTime = data.toString();
      this.defaultMinutes = defaultTime.split(":")[0];
      this.defaultSeconds = defaultTime.split(":")[1];
      this.minutes = this.defaultMinutes;
      this.seconds = this.defaultSeconds;
    }
  },
  data() {
    return {
      minutes: 1,
      seconds: 0,
      timer: null,
      running: false,
      defaultMinutes: 1,
      defaultSeconds: 0
    };
  },
  methods: {
    startTimer() {
      this.defaultMinutes = this.minutes;
      this.defaultSeconds = this.seconds;

      fs.writeFile(
        path_to_settings,
        `${this.defaultMinutes}:${this.defaultSeconds}`,
        err => {
          if (err) {
            return console.log("Failed to save default values");
          }
          console.log(
            `Saved ${this.defaultMinutes}:${this.defaultSeconds} as default`
          );
        }
      );

      this.timer = setInterval(() => this.countdown(), 1000);
      this.running = true;
    },
    resetTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.minutes = 1;
      this.seconds = 0;
      this.running = false;
      this.minutes = this.defaultMinutes;
      this.seconds = this.defaultSeconds;
    },
    countdown() {
      this.seconds--;
      if (this.seconds < 0) {
        this.minutes--;
        if (this.minutes < 0) {
          new Notification("Time's Up!", {
            body: "Woo hoo! A desktop notification!"
          });
          this.resetTimer();
        } else {
          this.seconds = 59;
        }
      }
    },
    increment() {
      this.minutes++;
    },
    decrement() {
      if (this.minutes > 1) {
        this.minutes--;
      }
    }
  },
  computed: {
    minutesText() {
      return String(this.minutes).padStart(2, "0");
    },
    secondsText() {
      return String(this.seconds).padStart(2, "0");
    }
  }
};
</script>
```

### Stylistic changes

Our timer is is a tad ugly.

Let's add some CSS to make things look a bit better in our `App.vue`:

```css
....
</script>

<style> // add the <style>...</style>
.timer {
  text-align: center;
}

.timer__title {
  font-family:'Courier New', Courier, monospace;
  font-size: 64px;
}
</style>
```

And add the `timer` and `timer__title` classes to the following, existing `div` and `h1` elements:

```html
<template>
<div class="timer">
  <h1 class="timer__title">{{minutesText}}:{{secondsText}}</h1>
....
```

To see the changes to our CSS, you may need to refresh the window by using `CTRL + R`.

Let's reduce the size of our app's window since we don't need a lot of space for our timer. In the `src/main/index.js` file, we can set the window's size. Look for the `createWindow` function in the `src/main/index.js` file:

```js
function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  });

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
```

The `mainWindow` refers to our app's window and we can set the size by changing the `width` and `height` options passed into the `BrowserWindow` constructor. Let's reduce the size of the height and width so our `mainWindow` code looks like this:

```javascript
mainWindow = new BrowserWindow({
  height: 200,
  useContentSize: true,
  width: 300
});
```

If you find Chromium's devtools to be in the way while running your app, you can have it closed by default by adding the following to the `BrowserWindow` constructor options too:

```javascript
webPreferences: {
  devTools: false;
}
```

You can still bring up devtools by using `CTRL + Shift + I`.

The `mainWindow` variable should look like the following:

```javascript
....
mainWindow = new BrowserWindow({
  height: 200,
  useContentSize: true,
  width: 300,
  // the below is optional
  webPreferences: {
    devTools: false
  }
})
....
```

Your timer should look like the below:
![Screenshot](https://i.imgur.com/XrTXpTw.png)

## Building the Desktop Executable

So far we've been running our desktop app using `npm run dev` which starts a local server and rerenders our application on changes. Let's build an executable so we can share our app with others and actually install it on to our system like we do with desktop apps.

To build the executable, run `npm run build` within `timer/`. It can take a while to build the executables for Windows/MacOS/Linux.
The executables will be located in `timer/build/`.

Note that you won't necessarily be able to build executables for all platforms from any development platform without some extra configuration. You can read more about Multi Platform Builds on [the docs for `electron-builder`](https://www.electron.build/multi-platform-build)

Once the `npm run build` is done, you should see your platform's, and possibly another platform's, executable. For Windows this is a `.exe` file and for MacOS it is a `.AppImage` file. For Linux, the executable's name is the project name with no extension, so it would be `timer` for our example.

## Additional Context

We finished building a timer in Electron and Vue. Writing a cross platform desktop app with Electron and Vue app is similar to writing a regular Vue application with Single File Components
but with additional APIs from Node and Electron.

Writing a desktop app with Electron and Vue is convenient for web developers. It enables web developers to leverage their prior knowledge and experience.

You can explore [Electron's documentation](https://electronjs.org/docs) and [electron-vue's documentation](https://simulatedgreg.gitbooks.io/electron-vue/content/) to build more complex Electron and Vue applications.

## When to Avoid

Electron applications tend to have larger build sizes and require more resources when compared to their native counterparts written in their respective operating systems' preferred language(s) and framework(s). This is because Electron bundles it's own version of Chromium, a browser, with your application. It doesn't matter if your system already has Chromium. Each Electron application comes with it's own browser.

If the performance and size of an application take priority over the convenience of using web technologies, then avoid building applications with Electron.

## Alternatives

There's an alternative to building cross platform desktop apps with Vue: [vuido](https://github.com/mimecorg/vuido). According to [it's documentation](https://github.com/mimecorg/vuido#development-status), it's still in early stage development. You can also build cross platform desktop apps, without Vue, using either [Qt](https://www.qt.io/) or [Proton Native](https://proton-native.js.org/#/). Vuido, Qt, and Proton Native offer better performance and smaller app sizes than apps built with Electron.

You can build desktop apps in each operating systems preferred language and framework too. This usually translates to maintaining three codebases with similar function and form but usually reaps the best performance and smallest application size.
