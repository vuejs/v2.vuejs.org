all: update
	rm db.json
	hexo generate
	cp -R examples public
	cp -R perf public
	cp -R ../vue/test public

deploy:	all
	hexo deploy

update:
	cd ../vue && git checkout dev && git pull && grunt build
	cp ../vue/dist/vue.min.js themes/vue/source/js/vue.min.js