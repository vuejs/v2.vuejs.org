all: update deploy

deploy:
	rm -rf public db.json
	node install.js
	hexo generate
	hexo deploy

update:
	cd ../vue && \
		git checkout -- dist && \
		git checkout master && \
		npm run build
	cp ../vue/dist/vue.min.js themes/vue/source/js/vue.min.js
	cp ../vue/dist/vue.js themes/vue/source/js/vue.js
	node update.js
