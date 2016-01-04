var ngComboTpl = ''
+'<div class="ngCombo" ng-mouseleave="showList=false">'
+'  <div class="ngComboMask" ng-hide="showList" ng-click="showListAndFocus()"></div>'
+'  <div class="selectedItems" ng-hide="showList">'
+'    <div class="placeholder" ng-bind="placeholder" ng-hide="selectedItems.length"></div>'
+'    <span ng-repeat="item in selectedItems" ng-bind="item.text || item" ng-click="remove(item)"></span>'
+'  </div>'
+'  <div ng-show="showList" class="show-list">'
+'    <input class="comboQuery" ng-model="query" placeholder="在此输入搜索内容" ng-keyup="addOne($event)">'
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
    controller: function ($scope, $filter) {
      $scope.addOne = function (event) {
        var shownItems = $filter('filter')($scope.data, $scope.query);
        if (shownItems.length === 1 && event.which == 13) {
          $scope.add(shownItems[0]);
        }
      };
    },
    link: function (scope, elem, attrs, ngModelCtrl) {
      scope.selectedItems = [];
      scope.input = scope.input || [];
      scope.placeholder = scope.placeholder || '点击选择';

      scope.showListAndFocus = function () {
        scope.showList = true;
        // make this async
        setTimeout(function () {
          elem[0].querySelector('.comboQuery').focus();
        }, 0);
      };

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
