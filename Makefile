all: update
	rm db.json
	hexo generate
	cp -R perf public
	cp -R ../vue/test public

deploy:	all
	hexo deploy

update:
	cd ../vue && git checkout master && git pull && grunt build
	cp ../vue/dist/vue.min.js themes/vue/source/js/vue.min.js
	cp ../vue/dist/vue.js perf/todomvc-benchmark/vue/bower_components/vue/vue.js
	node update.js