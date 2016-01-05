var ngComboTpl = ''
+'<div class="ngCombo" ng-mouseleave="showList=false">'
+'  <div class="ngComboMask" ng-hide="showList || selectedItems.length" ng-click="showListAndFocus()"></div>'
+'  <div class="selectedItems" ng-hide="showList" ng-click="showListAndFocus()">'
+'    <div class="placeholder" ng-bind="placeholder" ng-hide="selectedItems.length"></div>'
+'    <span ng-repeat="item in selectedItems">{{formatter(item)}}<i ng-click="remove(item, $event)">&times;</i></span>'
+'  </div>'
+'  <div ng-show="showList" class="show-list">'
+'    <input class="comboQuery" ng-model="query" placeholder="在此输入搜索内容" ng-keyup="onInput($event, results)">'
+'    <div class="optionList">'
+'      <div ng-bind="formatter(item)"'
+'           class="option" ng-class="{selected: isSelected(item)}"'
+'           ng-repeat="item in data | filter : query as results" ng-click="toggle(item)">'
+'      </div>'
+'    </div>'
+'  </div>'
+'</div>';

angular.module('ngCombo', [])
.directive('ngCombo', function () {
  return {
    restrict: 'AE',
    template: ngComboTpl,
    scope: {
      input: '=ngModel',
      data: '=ncData',
      formatter: '=ncFormatter',
      parser: '=ncParser',
      placeholder: '@placeholder'
    },
    require: 'ngModel',
    link: function (scope, elem, attrs, ngModelCtrl) {
      scope.selectedItems = [];
      scope.input = scope.input || [];
      scope.placeholder = scope.placeholder || '点击选择';

      scope.formatter = angular.isFunction(scope.formatter) ? scope.formatter : function (item) {
        return item.text || item;
      };
      scope.parser = angular.isFunction(scope.parser) ? scope.parser : function (item) {
        return item;
      };

      scope.onInput = function (event, results) {
        if (results && results.length === 1 && event.which == 13) {
          scope.add(results[0]);
          scope.query = '';
        }
      };

      scope.showListAndFocus = function () {
        scope.showList = true;
        // make it async
        setTimeout(function () {
          elem[0].querySelector('.comboQuery').focus();
        }, 100);
      };

      scope.add = function (item) {
        if (scope.selectedItems.indexOf(item) === -1) {
          scope.selectedItems.push(item);
          scope.input = scope.selectedItems.map(scope.parser);
        }
      };

      scope.remove = function (item, event) {
        event && event.stopPropagation();
        var idx = scope.selectedItems.indexOf(item);
        if (idx > -1) {
          scope.selectedItems.splice(idx, 1);
          scope.input = scope.selectedItems.map(scope.parser);
        }
      };

      scope.isSelected = function (item) {
        return scope.selectedItems.indexOf(item) > -1;
      };

      scope.toggle = function (item) {
        scope[scope.isSelected(item) ? 'remove' : 'add'](item);
      };
    }
  };
});
