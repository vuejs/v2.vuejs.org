rm db.json
hexo generate
cp -R examples public
cp -R perf public
cp -R ../vue/test public
hexo deploy