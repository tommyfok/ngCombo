var ngComboTpl = ''
+'<div class="ngCombo" ng-mouseenter="overComponent=true" ng-mouseleave="overComponent=false;hideListIfBlured()">'
// +'  <div class="ngComboMask" ng-hide="showList" ng-click="showListAndFocus()"></div>'
+'  <div class="selectedItems" ng-click="showListAndFocus()">'
+'    <div class="placeholder" ng-bind="placeholder" ng-hide="selectedItems.length"></div>'
+'    <span ng-repeat="item in selectedItems track by $index">{{_formatter(item)}}<i ng-click="remove(item, $event)" ng-hide="showList">&times;</i></span>'
+'  </div>'
+'  <div ng-show="showList" class="show-list" ng-class="{nb:!filteredData.length}">'
+'    <input class="comboQuery" ng-model="query" ng-focus="isBlured=false;updateInputPos()" ng-blur="isBlured=true;hideListAsyn()" placeholder="{{scope.placeholder}}" ng-keydown="onInput($event, filteredData)">'
+'    <div class="optionList" ng-show="filteredData.length">'
// +'      <div ng-bind="_formatter(item)"'
// +'           class="option" ng-class="{selected: isSelected(item)}"'
// +'           ng-repeat="item in selectedItems track by $index" ng-click="toggle(item)">'
// +'      </div>'
+'      <div ng-bind="_formatter(item)"'
+'           class="option" ng-class="{selected: isSelected(item), hovered: hoverIndex == $index}"'
+'           ng-repeat="item in filteredData track by $index" ng-click="toggle(item)">'
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
      var inputElem = $(elem).find('input.comboQuery');
      scope.input = scope.input || [];
      scope.placeholder = scope.placeholder || '';
      scope.filteredData = [];
      scope.isBlured = true;

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
          scope.selectedItems = getMatchedItemsFromInput();
        }, function (res, status) {
          console.log('ngCombo request error:', arguments);
        })
      } else {
        scope.selectedItems = getMatchedItemsFromInput();
      }

      function getMatchedItemsFromInput () {
        if (!((scope.data && scope.data.length) || scope.input.length)) {
          return [];
        } else {
          var result = [];
          scope.data.forEach(function (item) {
            if (scope.input.indexOf(scope._parser(item)) > -1) {
              result.push(item);
            }
          });
          return result;
        }
      }

      scope.updateInputPos = function (isBlur) {
        var lastItem = $(elem).find('.selectedItems span').last()[0];

        if (lastItem && !isBlur) {
          var pbb = lastItem.parentNode.getBoundingClientRect();
          var bb = lastItem.getBoundingClientRect();
          var expectLeft = bb.right - pbb.left + 5;
          var isOverflow = expectLeft + 100 > pbb.width;
          var posObj = {
            left: isOverflow ? 0 : expectLeft,
            top: isOverflow ? (bb.bottom - pbb.top) : (bb.top - pbb.top - 5)
          };
          inputElem.css(posObj);
          $(elem).find('.optionList').css({
            marginTop: 34 + posObj.top
          });
          $(elem).find('.ngCombo .selectedItems').css({
            paddingBottom: isOverflow ? 28 : 0
          });
        } else {
          inputElem.css({
            left: '',
            top: ''
          });
          $(elem).find('.optionList').css({
            marginTop: 34
          });
          $(elem).find('.ngCombo .selectedItems').css({
            paddingBottom: 0
          });
        }
      };

      scope.onInput = function (event, results) {
        var code = event.which;
        if (code == 13 && results) {
          var toSelectItem = results[scope.hoverIndex] || results[0];
          if (toSelectItem) {
            event.preventDefault();
            event.stopPropagation();
            scope.add(toSelectItem);
            scope.query = '';
            // scope.showList = false;
            $timeout(function () {
              scope.updateInputPos();
              scope.showListAndFocus();
              scope.hoverIndex = -1;
            }, 100);
          }
        } else if (code == 8 && scope.query == '') {
            var lastItem = scope.selectedItems[scope.selectedItems.length-1];
            lastItem && scope.remove(lastItem, event);
            setTimeout(function () {
              scope.updateInputPos();
            }, 50);
        } else if (results && results.length) {
          var up = code == 38;
          var down = code == 40;
          if (up) {
            scope.hoverIndex--;
            scope.hoverIndex = scope.hoverIndex > -1 ? scope.hoverIndex : 0;
          }
          if (down) {
            scope.hoverIndex++
            scope.hoverIndex = scope.hoverIndex < results.length ? scope.hoverIndex : (results.length - 1);
          }
        } else {
          scope.hoverIndex = 0;
        }
      };

      scope.hideListIfBlured = function () {
        if (scope.isBlured) {
          scope.query = '';
          scope.showList = false;
          scope.updateInputPos(true);
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
          scope.input.push(scope._parser(item));
        }
      };

      scope.remove = function (item, event) {
        event && event.stopPropagation();
        var idx = scope.selectedItems.indexOf(item);
        if (idx > -1) {
          scope.selectedItems.splice(idx, 1);
          scope.input.splice(idx, 1);
        }
      };

      scope.isSelected = function (item) {
        return scope.selectedItems.indexOf(item) > -1;
      };

      scope.toggle = function (item) {
        scope.updateInputPos();
        scope[scope.isSelected(item) ? 'remove' : 'add'](item);
        scope.query = '';
        scope.showListAndFocus();
      };

      scope.hideListAsyn = function () {
        $timeout(function () {
          if (!scope.overComponent) {
            scope.query = '';
            scope.showList = false;
            scope.updateInputPos(true);
          }
        }, 100);
      };

      scope.$watch('query', function (newQuery) {
        var filtered = $filter('filter')(scope.data, newQuery) || [];
        scope.filteredData = filtered ? filtered.slice(0, scope.limit ? Math.min(scope.limit, filtered.length) : 10) : [];
      });

      scope.$watch('input', function () {
        if (scope.data) {
          scope.selectedItems = getMatchedItemsFromInput();
        }
      });
    }
  };
});
