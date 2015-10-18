all:
	rm db.json
	hexo generate
	cp -R ./todomvc public/examples
	hexo deploy
