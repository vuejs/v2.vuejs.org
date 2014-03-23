all: update
	rm db.json
	hexo generate
	cp -R perf public
	cp -R ../vue/test public

deploy:	all
	hexo deploy

update:
	cd ../vue && git checkout master && grunt build
	cp ../vue/dist/vue.min.js themes/vue/source/js/vue.min.js
	cp ../vue/dist/vue.min.js perf/todomvc-benchmark/todomvc/vue/bower_components/vue/vue.min.js
	node update.js