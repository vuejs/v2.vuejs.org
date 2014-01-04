rm db.json
hexo generate
cp -R examples public
hexo deploy