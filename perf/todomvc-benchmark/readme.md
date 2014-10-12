# updating frameworks

```shell
./update-framework.sh
```

# Knockout

Reproduce this commit log, to make Knockout example work:

```
--- a/perf/todomvc-benchmark/todomvc/knockoutjs/js/app.js
+++ b/perf/todomvc-benchmark/todomvc/knockoutjs/js/app.js
@@ -186,7 +186,7 @@
        var todos = ko.utils.parseJson(localStorage.getItem('todos-knockoutjs'));
 
        // bind a new instance of our view model to the page
-       var viewModel = new ViewModel(todos || []);
+       var viewModel = window.viewModel = new ViewModel(todos || []);
```
