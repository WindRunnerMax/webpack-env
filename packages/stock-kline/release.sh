#!/bin/bash

version=$(echo "console.log(require(\"./package.json\").version)" | node)
tagName=stock-kline@$version

echo $tagName

git tag -a $tagName -m "stock-kline"
git push origin $tagName
