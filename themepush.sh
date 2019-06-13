#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# cd docs/.vuepress/theme

node changeVersion.js

npm publish

git add -A

git commit -m '脚本提交'

git push -u origin master

cd -