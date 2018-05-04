---
title: Building Desktops Apps with Electron and Vue
type: cookbook
order: 11
---

In this cookbook, we're going to show you how to build desktop applications
with Electron and Vue. We'll build a minimal markdown editor that can
save files and send desktop notifications.

## Why Electron?

[Electron](https://electronjs.org/) enables developers to use web technologies
to build cross platform desktop apps. It accomplishes this by
["by combining Chromium and Node.js into a single runtime and apps can be packaged for Mac, Windows, and Linux"](https://electronjs.org/docs/tutorial/about#about-electron).
This enables us to use Vue.js (and other front end frameworks) for building
the UI of a desktop app and it gives us access to Node and Electron APIs within our apps.

Let's get started and we'll explain more things as we go.

## Getting Started

First, you'll need to install `vue-cli`.

```
$ npm install -g vue-cli
```

Next, we're going to set up our project with a pre-existing Electron + Vue template.

```
$ vue init simulatedgreg/electron-vue my-markdown-editor
```

During the set up process, you'll be asked to choose which Vue plugins to install
and which build tool you would like to use.
**For this example, we need to install the `vue-electron` plugin
and choose `electron-builder` for our build tool.**
The `vue-electron` plugin makes Electron's APIs available for use within our Vue
components. We'll use `electron-builder` to package our application into an
executable for Windows, Mac, and Linux.

To install all necessary dependencies, `cd my-markdown-editor` then run:

```
$ npm install
```

Launch the application by running:

```
$ npm run dev
```

Upon launch, you should be greeted with the following:

![Electron + Vue Starter Template](https://raw.githubusercontent.com/konaraddio/vue-electron-cookbook/master/starter-template.png)

We'll be writing Vue in the `src/renderer/` folder. Note that
there are two folders within the `src/` folder:
`main` and `renderer`.

Electron apps run two types of processes: the main and the renderer.
The renderer processes are responsible for rendering the webpages (the user interface) and
the main process is responsible for everything else,
including managing the renderer processes.

Node and [Electron APIs](https://electronjs.org/docs/api)
are accessible from the renderer processes.
This allows us to read and write to files, create desktop notifications,
start a server, create applications for TouchBar, and more!
Imagine a browser with access to operating system APIs and you've got an Electron application.

You can read more about [the main and renderer processes at Electron's documentation](https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes).

## Building a Markdown Editor

First we're going to write a markdown editor like we would in a regular Vue.js app.
Then we'll introduce a button that saves the markdown file to the user's computer
and sends a desktop notification on save.

### A Simple Markdown Editor

Install `marked` and `lodash`. We'll use `marked` for rendering our markdown
to html. We'll use `lodash` so we can render the markdown as html after the
user stops typing for a brief moment.

```
$ npm i -S marked lodash
```

Delete the components inside `src/render/components`.
Create a component called `MarkdownEditor.vue` with the following code:

```
<template>
<div id="editor">
  <textarea :value="input" @input="update"></textarea>
  <div v-html="compiledMarkdown"></div>
</div>
</template>

<script>
import _ from "lodash";
import marked from "marked";

export default {
  name: "MarkdownEditor",
  data() {
    return {
      input: "# hello"
    };
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.input, { sanitize: true });
    }
  },
  methods: {
    update: _.debounce(function(e) {
      this.input = e.target.value;
    }, 300)
  }
};
</script>


<style scoped>
html,
body,
#editor {
  margin: 0;
  height: 100%;
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #333;
}

textarea,
#editor div {
  display: inline-block;
  width: 49%;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: "Monaco", courier, monospace;
  padding: 20px;
}

code {
  color: #f66;
}
</style>
```

We just recreated [the simple markdown editor from the Vue.js examples](https://vuejs.org/v2/examples/)
in a Single File Component.

In the `src/renderer/App.vue` file, replace references to the LandingPage component
with our new MarkdownEditor component.

Your `App.vue` file should look like this:

```
<template>
  <div id="app">
    <markdown-editor></markdown-editor>
  </div>
</template>

<script>
import MarkdownEditor from "@/components/MarkdownEditor";

export default {
  name: "my-markdown-editor",
  components: {
    MarkdownEditor
  }
};
</script>
```

Let's make our markdown editor
take up all the space in the our application's window by adding the following
CSS to our `App.vue` file:

```css
<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
```

Run `npm run dev` within our project folder and you should see this:

![Dead Simple Markdown Editor in Electron](https://raw.githubusercontent.com/konaraddio/vue-electron-cookbook/master/dead-simple-markdown-editor.png)

### Saving Files

Let's add saving functionality to our markdown editor.

We'll use the [`dialog`](https://electronjs.org/docs/api/dialog)
from the Electron APIs and [`fs`](https://nodejs.org/api/fs.html)
from the Node APIs.
Import `dialog` and `fs` at the top of our `MarkdownEditor.vue` file:

```
....

<script>
import _ from "lodash";
import marked from "marked";

/* add the two lines below */
import fs from "fs";
const { dialog } = require("electron").remote;

....
```

Next, let's add the `save` function to our `MarkdownEditor.vue`:

```
....
methods: {
    update: _.debounce(function(e) {
      this.input = e.target.value;
    }, 300),
    /* add the function below */
    save() {
      dialog.showSaveDialog(fileName => {
        fs.writeFile(fileName, this.input, err => {
          if (err) {
            alert("Error with saving file");
          } else {
            alert("File saved!");
          }
        });
      });
    }
}
....
```

Then we'll add a save button to our `MarkdownEditor.vue`:

```
....
<template>
<div id="editor">
  <textarea :value="input" @input="update"></textarea>
  <div v-html="compiledMarkdown"></div>
  <!--Add the below-->
  <button @click="save">SAVE</button>
</div>
</template>
....
```

Let's add some CSS for our new save button and change the previous CSS.
Delete the previous styles then copy and paste the below
into your `MarkdownEditor.vue`:

```css
<style scoped>
html,
body,
#editor {
  margin: 0;
  height: 95%;
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #333;
}

textarea,
#editor div {
  display: inline-block;
  width: 49%;
  height: 95%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: "Monaco", courier, monospace;
  padding: 20px;
}

code {
  color: #f66;
}

button {
  width: 100%;
  height: 10%;
  font-weight: bold;
  color: #333;
  background-color: #f6f6f6;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

button:hover {
  cursor: pointer;
  background-color: #333;
  color: #f6f6f6;
}
</style>
```

Refresh your Electron app and you should see the below:

![Markdown Editor with Save Button](https://raw.githubusercontent.com/konaraddio/vue-electron-cookbook/master/markdown-editor-with-save-button.png)

When you click the save button you should see a dialog that asks you
to choose a folder and file name.

### Desktop Notifications

Let's make it so whenever the user saves the documentation, they get a notification
on their desktop.

You can use the HTML5 Notification API to send desktop notifications.
Electron will send a desktop notification instead of
an in-browser notifcation.
Replace the `alert('File saved!')` in the `save` method
in `src/renderer/components/MarkdownEditor.vue`
with the following:

```
....
new Notification('My Markdown Editor', {
  body: 'File saved!'
})
...
```

So your `MarkdownEditor.vue` file should contain the following:

```
<template>
<div id="editor">
  <textarea :value="input" @input="update"></textarea>
  <div v-html="compiledMarkdown"></div>
  <button @click="save">SAVE</button>
</div>
</template>

<script>
import _ from "lodash";
import marked from "marked";

import fs from "fs";
const { dialog } = require("electron").remote;

export default {
  name: "MarkdownEditor",
  data() {
    return {
      input: "# hello"
    };
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.input, { sanitize: true });
    }
  },
  methods: {
    update: _.debounce(function(e) {
      this.input = e.target.value;
    }, 300),
    save() {
      dialog.showSaveDialog(fileName => {
        fs.writeFile(fileName, this.input, err => {
          if (err) {
            alert("Error with saving file");
          } else {
            new Notification("My Markdown Editor", {
              body: "File saved!"
            });
          }
        });
      });
    }
  }
};
</script>


<style scoped>
html,
body,
#editor {
  margin: 0;
  height: 95%;
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #333;
}

textarea,
#editor div {
  display: inline-block;
  width: 49%;
  height: 95%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: "Monaco", courier, monospace;
  padding: 20px;
}

code {
  color: #f66;
}

button {
  width: 100%;
  height: 10%;
  font-weight: bold;
  color: #333;
  background-color: #f6f6f6;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

button:hover {
  cursor: pointer;
  background-color: #333;
  color: #f6f6f6;
}
</style>
```

Now when you save your markdown file, you should get a desktop notification.

We're almost done with our markdown editor. The last step is building the executable to share it.

### Building the Executable

To build the executable, run `npm run build` within `my-markdown-editor`.
This will take a while and build the executables for Windows/MacOS/Linux.
The executables are located in `my-markdown-editor/build/`.

Note that you won't necessarily be able to build executables for all platforms
on any development platform without some extra configuration.
You can read more about Multi Platform Builds on the docs for `electron-builder`:
https://www.electron.build/multi-platform-build

Once you've run `npm run build`, you should see
your platform's, and possibly another platform's, executable. For Windows this is a `.exe` file and for MacOS it is a `.AppImage` file. For Linux, the executable's name is the project name with no extension, so `my-markdown-editor` for our example.

## Conclusion

We just wrote a simple markdown editor in Electron and Vue.
Writing an Electron + Vue app is like writing a regular Vue.js application but with
Node and Electron APIs available, and then building a desktop app from it.

Writing a desktop application with Electron and Vue is convenient for web developers.
It lets web developers leverage their prior knowledge and build a cross platform app.
However, without making several changes to the default configuration,
Electron applications tend to have larger build sizes and require more resources
when compared to their native counterparts written in their respective
operating systems' preferred language(s) and framework(s).

I encourage you to explore [Electron's documentation](https://electronjs.org/docs)
and [electron-vue's documentation](https://simulatedgreg.gitbooks.io/electron-vue/content/)
to build more complex Electron + Vue applications.
