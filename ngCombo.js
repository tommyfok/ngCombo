var ngComboTpl = ''
+'<div class="ngCombo">'
+'  <div class="ngComboMask" ng-hide="showList" ng-click="showList=true"></div>'
+'  <div class="selectedItems">'
+'    <div class="placeholder" ng-bind="placeholder" ng-hide="selectedItems.length"></div>'
+'    <span ng-repeat="item in selectedItems" ng-bind="item.text || item" ng-click="remove(item)"></span>'
+'  </div>'
+'  <span class="dropdownIcon" ng-click="showList=!showList">{{showList ? \'－\' : \'+\'}}</span>'
+'  <div ng-show="showList">'
+'    <input class="comboQuery" ng-model="query" placeholder="在此输入搜索内容">'
+'    <div class="optionList">'
+'      <div class="option" ng-class="{selected: isSelected(item)}"'
+'           ng-repeat="item in data | filter : query" ng-click="toggle(item)">'
+'        <span ng-show="isSelected(item)" class="glyphicon glyphicon-ok"></span> {{item.text || item}}'
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
      placeholder: '@placeholder'
    },
    require: 'ngModel',
    link: function (scope, elem, attrs, ngModelCtrl) {
      scope.selectedItems = [];
      scope.input = scope.input || [];
      scope.placeholder = scope.placeholder || '点击选择';

      scope.add = function (item) {
        if (scope.selectedItems.indexOf(item) === -1) {
          scope.selectedItems.push(item);
          scope.input = scope.selectedItems.map(formatOutput);
        }
      };

      scope.remove = function (item) {
        var idx = scope.selectedItems.indexOf(item);
        if (idx > -1) {
          scope.selectedItems.splice(idx, 1);
          scope.input = scope.selectedItems.map(formatOutput);
        }
      };

      scope.isSelected = function (item) {
        return scope.selectedItems.indexOf(item) > -1;
      };

      scope.toggle = function (item) {
        scope[scope.isSelected(item) ? 'remove' : 'add'](item);
      };

      function formatOutput (item) {
        if (typeof item === 'string') {
          return item;
        } else {
          return item.value || item.text;
        }
      }
    }
  };
});
