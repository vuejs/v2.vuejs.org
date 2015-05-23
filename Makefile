all: update
	hexo generate
	cp -R ../vue/test/unit public
	cp -R ./todomvc public/examples

deploy:	all
	hexo deploy

update:
	cd ../vue && git checkout master && grunt build && grunt build-test
	cp ../vue/dist/vue.min.js themes/vue/source/js/vue.min.js
	cp ../vue/dist/vue.js themes/vue/source/js/vue.js
	node update.js