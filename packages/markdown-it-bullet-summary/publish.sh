#!/bin/bash

npm run build
npm login --registry https://registry.npmjs.org/
npm publish --registry=https://registry.npmjs.org/ --access public
