# ngCombo
Combobox Component for AngularJS.
Support multiple select.

## Installation
1. With Bower :
   - `bower install --save ngCombo`

   Or download `ngCombo.js` & `ngCombo.css` manually

2. include `ngCombo.js` & `ngCombo.css` after your `angular.js` file

3. adding `ngCombo` as a module dependency to your application

## [Demo](http://tommyfok.github.io/ngCombo/demo.html)

## Useage
```javascript
$scope.pkgNames = [
  {text: 'tom', value: 1},
  {text: 'jerry', value: 2},
  {text: 'dickson', value: 3},
  {text: 'bob', value: 4},
  {text: 'jade', value: 5}
];
```
```html
<div ng-combo
     ng-model="pkgName"
     nc-data="pkgNames"
     placeholder="Type in package name."></div>
```
## ScreenShot
![ScreenShot](http://tommyfok.github.io/ngCombo/screenshot.jpg)
> too lazy to write more...
