all: update deploy

deploy:
	rm -f db.json
	hexo generate
	cp -R ./todomvc public/examples
	hexo deploy

update:
	cd ../vue && \
		git checkout -- dist && \
		git checkout dev && \
		npm run build
	cp ../vue/dist/vue.min.js themes/vue/source/js/vue.min.js
	cp ../vue/dist/vue.js themes/vue/source/js/vue.js
	node update.js
