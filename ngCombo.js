var ngComboTpl = ''
+'<div class="ngComboWrapper">'
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

var ngComboStyle = '<style>.ngComboWrapper{position:relative;border:1px solid #ddd;font-size:14px}.ngComboWrapper .placeholder{line-height:38px;padding-left:10px;font-size:12px;color:#789}.ngComboMask{position:absolute;z-index:2;width:100%;height:100%;cursor:pointer;left:0;top:0}.ngComboWrapper .dropdownIcon{position:absolute;right:5px;top:5px;line-height:30px;width:30px;cursor:pointer;text-align:center;font-size:24px;font-weight:bold}.ngComboWrapper .dropdownIcon:hover{color:#f60}.ngComboWrapper .selectedItems{min-height:38px;padding-right:40px;padding-bottom:5px;}.ngComboWrapper .selectedItems span{margin:5px 0 0 5px;display:inline-block;cursor:pointer;color:#fff;background:#5cb85c;padding:5px;border-radius:3px}.ngComboWrapper .optionList{max-height:182px;overflow:auto;position:absolute;right:-1px;left:-1px;top:100%;border:1px solid #ddd}.ngComboWrapper .option{line-height:30px;padding:0 10px;cursor:pointer;background:#fefefe}.ngComboWrapper .option:nth-child(2n){background:#fafafa}.ngComboWrapper .option.selected{color:#5cb85c}.ngComboWrapper .comboQuery,.ngComboWrapper .comboQuery:focus{border:0;box-shadow:none;border-radius:0;background:#fafafa;outline:0;display:block;padding:0 10px;line-height:30px;width:100%;box-sizing:border-box}.ngComboWrapper .option:hover{color:#f60}</style>';

angular.module('ngCombo', [])
.directive('ngCombo', function () {
  return {
    restrict: 'AE',
    template: ngComboTpl + ngComboStyle,
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
