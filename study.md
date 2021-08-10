# esleint
when I run `npm run syntax`, I get this error:
```
ESLint couldn't find the config "airbnb-base" to extend from. Please check that the name of the config is correct.

The config "airbnb-base" was referenced from the config file in "/workspace/.eslintrc.js".
```
That means a package missed. To install it:
```
npx install-peerdeps --dev eslint-config-airbnb-base
```
