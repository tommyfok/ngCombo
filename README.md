# ngAutoComplete
Auto Complete Module for AngularJS.

Support multiple select.

## Installation
1. With Bower :
   - `bower install --save ngAutoComplete`

   Or download `ngAutoComplete.js` manually

2. include `ngAutoComplete.js` after your `angular.js` file

3. adding `ngAutoComplete` as a module dependency to your application

## Useage
```javascript
$scope.pkgNames = ['tom', 'tommy', 'nancy', 'fun', 'chole'];
$scope.fnFormatter = function (item) {
  // show 'tomtom' in the list for example
  return item + item;
};
$scope.fnParser = function (item) {
  // show 'tomtomtom' in the input for example
  return item + item + item;
};
```
```html
<div ng-auto-complete
     ng-model="pkgName"
     nac-data="pkgNames"
     nac-formatter="fnFormatter"
     nac-parser="fnParser"
     placeholder="Type in package name."></div>
```
## ScreenShot
![ScreenShot](https://tommyfok.github.io/ngAutoComplete/screenshot.png)
> too lazy to write more...
