all: update
	rm -f db.json
	hexo generate
	cp -R ../vue/test/unit public

deploy:	all
	hexo deploy

update:
	cd ../vue && git checkout master && grunt build && grunt build-test
	cp ../vue/dist/vue.min.js themes/vue/source/js/vue.min.js
	node update.js