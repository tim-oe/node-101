!bin/sh
# basic node init
npm init -y
# generate ignore file
npx gitignore node
# typescript install
npm install --save-dev typescript @types/node ts-node nodemon tsconfig-paths
# tsconfig
npx tsc --init --rootDir src --outDir build --esModuleInterop --resolveJsonModule --lib es6 --module commonjs --allowJs true --noImplicitAny true
# jest install
npm install --save-dev jest @types/jest
# jest.config, follow prompts
jest --init
# eslint install
npm install eslint --save-dev
# eslint init, follow prompts
npx eslint --init
# jsDoc install
npm add --save-dev jsdoc docdash jsdoc-to-markdown


