rm db.json
hexo generate
cp -R examples public
cp -R perf public
hexo deploy