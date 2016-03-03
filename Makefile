all: update deploy

deploy:
	rm -f db.json
	hexo generate
	cp -R ./todomvc public/examples
	mkdir -p public/unit
	cp -R ../vue/test/unit/lib/ public/unit/lib
	cp ../vue/test/unit/index.html public/unit/index.html
	cp ../vue/test/unit/specs.js public/unit/specs.js
	cp ../vue/test/unit/specs.js.map public/unit/specs.js.map
	hexo deploy

update:
	cd ../vue && \
		git checkout -- dist && \
		git checkout master && \
		npm run build && \
		npm run build-test > /dev/null
	cp ../vue/dist/vue.min.js themes/vue/source/js/vue.min.js
	cp ../vue/dist/vue.js themes/vue/source/js/vue.js
	node update.js
