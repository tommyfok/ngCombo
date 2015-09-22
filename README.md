# ngCombo
Combobox Component for AngularJS.
Support multiple select.

## Installation
1. With Bower :
   - `bower install --save ngCombo`

   Or download `ngCombo.js` manually

2. include `ngCombo.js` after your `angular.js` file

3. adding `ngCombo` as a module dependency to your application

## Useage
```javascript
$scope.pkgNames = ['tom', 'tommy', 'nancy', 'fun', 'chole'];
```
```html
<div ng-combo
     ng-model="pkgName"
     nc-data="pkgNames"
     placeholder="Type in package name."></div>
```
## ScreenShot
![ScreenShot](https://tommyfok.github.io/ngCombo/ngCombo.png)
> too lazy to write more...
