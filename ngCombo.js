var ngComboTpl = ''
+'<div class="ngCombo">'
+'  <div class="ngComboMask" ng-hide="showList || selectedItems.length" ng-click="showListAndFocus()"></div>'
+'  <div class="selectedItems" ng-hide="showList" ng-click="showListAndFocus()">'
+'    <div class="placeholder" ng-bind="placeholder" ng-hide="selectedItems.length"></div>'
+'    <span ng-repeat="item in selectedItems">{{_formatter(item)}}<i ng-click="remove(item, $event)">&times;</i></span>'
+'  </div>'
+'  <div ng-show="showList" class="show-list">'
+'    <input class="comboQuery" ng-model="query" ng-blur="hideListAsyn()" placeholder="{{scope.placeholder}}" ng-keyup="onInput($event, filteredData)">'
+'    <div class="optionList" ng-show="selectedItems.length + filteredData.length">'
+'      <div ng-bind="_formatter(item)"'
+'           class="option" ng-class="{selected: isSelected(item)}"'
+'           ng-repeat="item in selectedItems" ng-click="toggle(item)">'
+'      </div>'
+'      <div ng-bind="_formatter(item)"'
+'           class="option" ng-class="{selected: isSelected(item)}"'
+'           ng-repeat="item in filteredData" ng-if="!isSelected(item)" ng-click="toggle(item)">'
+'      </div>'
+'    </div>'
+'  </div>'
+'</div>';

angular.module('ngCombo', [])
.directive('ngCombo', function ($http, $filter, $timeout) {
  return {
    restrict: 'AE',
    template: ngComboTpl,
    scope: {
      input: '=ngModel',
      data: '=?ncData',
      src: '=?ncSrc',
      transform: '=?ncTransform',
      formatter: '=?ncFormatter',
      parser: '=?ncParser',
      placeholder: '@?placeholder',
      limit: '=?ncLimit'
    },
    require: 'ngModel',
    link: function (scope, elem, attrs, ngModelCtrl) {
      scope.selectedItems = [];
      scope.input = scope.input || [];
      scope.placeholder = scope.placeholder || '';
      scope.filteredData = [];

      scope._formatter = angular.isFunction(scope.formatter) ? scope.formatter : function (item) {
        return item.text || item;
      };
      scope._parser = angular.isFunction(scope.parser) ? scope.parser : function (item) {
        return item;
      };

      if (scope.src && !scope.data) {
        $http[scope.src.toLowerCase().indexOf('callback=') > -1 ? 'jsonp' : 'get'](scope.src)
        .then(function (res, status) {
          console.log('ngCombo request success:', arguments);
          scope.data = scope.transform ? scope.transform(res.data) : res.data;
        }, function (res, status) {
          console.log('ngCombo request error:', arguments);
        })
      }

      scope.onInput = function (event, results) {
        if (results && results.length === 1 && event.which == 13) {
          scope.add(results[0]);
          scope.query = '';
          scope.showList = false;
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
          scope.input = scope.selectedItems.map(scope._parser);
        }
      };

      scope.remove = function (item, event) {
        event && event.stopPropagation();
        var idx = scope.selectedItems.indexOf(item);
        if (idx > -1) {
          scope.selectedItems.splice(idx, 1);
          scope.input = scope.selectedItems.map(scope._parser);
        }
      };

      scope.isSelected = function (item) {
        return scope.selectedItems.indexOf(item) > -1;
      };

      scope.toggle = function (item) {
        scope[scope.isSelected(item) ? 'remove' : 'add'](item);
      };

      scope.hideListAsyn = function () {
        $timeout(function () {
          scope.showList = false;
        }, 50);
      };

      scope.$watch('query', function (newQuery) {
        var filtered = $filter('filter')(scope.data, newQuery) || [];
        scope.filteredData = filtered ? filtered.slice(0, scope.limit ? Math.min(scope.limit, filtered.length) : 10) : [];
      });
    }
  };
});
