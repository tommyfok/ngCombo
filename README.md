# ngCombo
Combobox Component for AngularJS.
Support multiple select.

## [Demo](http://tommyfok.github.io/ngCombo/demo.html)

## Installation
1. With Bower :
   - `bower install --save ngCombo`

   Or download `ngCombo.js` & `ngCombo.css` manually

2. include `ngCombo.js` & `ngCombo.css` after your `angular.js` file

3. adding `ngCombo` as a module dependency to your application

## Usage
```javascript
$scope.pkgNames = [
  {text: 'tom', value: 1},
  {text: 'jerry', value: 2},
  {text: 'dickson', value: 3},
  {text: 'bob', value: 4},
  {text: 'jade', value: 5}
];

$scope.formatter = function (item) {
  return item.text.toUpperCase();
};

$scope.parser = function (item) {
  return Math.pow(item.value, 2);
};
// 通常和nc-src配合使用
$scope.transform = function (data) {
  return data.data;
}
```
```html
<div ng-combo
     nc-limit="30"
     ng-model="values"
     nc-data="pkgNames"
     nc-parser="parser"
     nc-formatter="formatter"
     nc-transform="transform"
     ng-disabled="aSwitchOfThisCombo"
     placeholder="Type in package name."
     nc-src="'http://lib.cdc.com/oaui/memberinput/data/allmember.php?callback=JSON_CALLBACK'">
</div>
```
