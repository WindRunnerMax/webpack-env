#!/bin/bash

version=$(echo "console.log(require(\"./package.json\").version)" | node)
tagName=stock-treading@$version

echo $tagName

git tag -a $tagName -m "stock-treading"
git push origin $tagName
