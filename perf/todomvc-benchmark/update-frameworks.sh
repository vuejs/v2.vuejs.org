wget https://github.com/tastejs/todomvc/archive/master.zip
unzip master.zip

rm -rf todomvc/angularjs-perf
mv todomvc-master/architecture-examples/angularjs-perf todomvc/

rm -rf todomvc/backbone
mv todomvc-master/architecture-examples/backbone todomvc/

rm -rf todomvc/emberjs
mv todomvc-master/architecture-examples/emberjs todomvc/

rm -rf todomvc/knockoutjs
mv todomvc-master/architecture-examples/knockoutjs todomvc/

rm -rf todomvc/ractive
mv todomvc-master/labs/architecture-examples/ractive todomvc/

rm -rf todomvc/react
mv todomvc-master/architecture-examples/react todomvc/

rm master.zip
rm -rf todomvc-master

# om
wget https://github.com/swannodette/todomvc/archive/gh-pages.zip
unzip gh-pages.zip
rm -rf todomvc/om
mv todomvc-gh-pages/labs/architecture-examples/om todomvc/

rm -rf todomvc-gh-pages
rm gh-pages.zip
