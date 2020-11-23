!bin/sh
# basic node init
npm init -y
# generate ignore file
npx gitignore node
# typescript install
npm i --save-dev typescript @types/node ts-node nodemon tsconfig-paths
# tsconfig
npx tsc --init --rootDir src --outDir build --esModuleInterop --resolveJsonModule --lib es6 --module commonjs --allowJs true --noImplicitAny true
# express
npm i express
npm i --save-dev @types/express
# jest install
npm i --save-dev jest @types/jest ts-jest
# install globally
sudo npm install -g jest
# jest.config, follow prompts
jest --init
# eslint install
npm i --save-dev eslint
# eslint init, follow prompts
npx eslint --init
# jsDoc install
npm add --save-dev jsdoc docdash jsdoc-to-markdown