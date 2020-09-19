<!DOCTYPE html>
<html>
  <head>
    <title>Tree View</title>
    <script src="https://unpkg.com/vue"></script>
    <link rel="stylesheet" type="text/css" href="/style.css" />

    <!-- item template -->
    <script type="text/x-template" id="item-template">
      <li>
        <div
          :class="{bold: isFolder}"
          @click="toggle"
          @dblclick="makeFolder">
          {{ item.name }}
          <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
        </div>
        <ul v-show="isOpen" v-if="isFolder">
          <tree-item
            class="item"
            v-for="(child, index) in item.children"
            :key="index"
            :item="child"
            @make-folder="$emit('make-folder', $event)"
            @add-item="$emit('add-item', $event)"
          ></tree-item>
          <li class="add" @click="$emit('add-item', item)">+</li>
        </ul>
      </li>
    </script>
  </head>
  <body>
    <p>(You can double click on an item to turn it into a folder.)</p>

    <!-- the demo root element -->
    <ul id="demo">
      <tree-item
        class="item"
        :item="treeData"
        @make-folder="makeFolder"
        @add-item="addItem"
      ></tree-item>
    </ul>

    <script>
      // demo data
      var treeData = {
        name: "My Tree",
        children: [
          { name: "hello" },
          { name: "wat" },
          {
            name: "child folder",
            children: [
              {
                name: "child folder",
                children: [{ name: "hello" }, { name: "wat" }]
              },
              { name: "hello" },
              { name: "wat" },
              {
                name: "child folder",
                children: [{ name: "hello" }, { name: "wat" }]
              }
            ]
          }
        ]
      };

      // define the tree-item component
      Vue.component("tree-item", {
        template: "#item-template",
        props: {
          item: Object
        },
        data: function() {
          return {
            isOpen: false
          };
        },
        computed: {
          isFolder: function() {
            return this.item.children && this.item.children.length;
          }
        },
        methods: {
          toggle: function() {
            if (this.isFolder) {
              this.isOpen = !this.isOpen;
            }
          },
          makeFolder: function() {
            if (!this.isFolder) {
              this.$emit("make-folder", this.item);
              this.isOpen = true;
            }
          }
        }
      });

      // boot up the demo
      var demo = new Vue({
        el: "#demo",
        data: {
          treeData: treeData
        },
        methods: {
          makeFolder: function(item) {
            Vue.set(item, "children", []);
            this.addItem(item);
          },
          addItem: function(item) {
            item.children.push({
              name: "new stuff"
            });
          }
        }
      });
    </script>
  </body>
</html>
