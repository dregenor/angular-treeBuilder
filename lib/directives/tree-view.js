
/*
module.directive("tree", function(RecursionHelper) {
    return {
        restrict: "E",
        scope: {family: '='},
        template: 
            '<p>{{ family.name }}</p>'+
            '<ul>' + 
                '<li ng-repeat="child in family.children">' + 
                    '<tree family="child"></tree>' +
                '</li>' +
            '</ul>',
        compile: function(element) {
            // Use the compile function from the RecursionHelper,
            // And return the linking function(s) which it returns
            return RecursionHelper.compile(element);
        }
    };
});
*/
angular.module('tree-builder.directives')
    .directive('tbTreeView',['RecursionHelper','tree-builder.config',function(RecursionHelper,config){
        return{
            template: 
                '<div class="tb-tree-view_node" style="left:{{node._x}}px;top:{{node._y}}px"' +
                      'ng-class="{expanded:node.expanded,has_childs:node._childs.length}" ng-click="expandToggle($event)">' +
                    '<div ng-if="node._parent" class="connection-line" ng-style="arrowStyle"></div>' +
                    '<span class="node-block_title">{{node.title}}</span>'+
                    //'<span class="node-block_description">{{node.description}}</span>'+
                    
                    '<div class="node-layer" ng-if="node.expanded && node._childs.length > 0 && node._childs.length < maxChields">' +
                        '<div class="node-child" tb-tree-view node="child" ng-repeat="child in node._childs" ' +
                            //'style="left:{{($index - (node._childs.length-1)/2)*200}}px"' +
                        '></div>' +
                    '</div>'+
                    '<div ng-if="node.expanded && node._childs.length>=maxChields" class="many-child tb-tree-view_node node-layer">' +
                        '<div class="connection-line"></div>' +
                        '<span class="many-child_count">' +
                            '{{node._childs.length}}' +
                        '</span>' +
                    '</div>'+
                '</div>',
            restrict: "A",
            scope:{
                'node':'=',                
                'blockSize':'@'
            },
            compile: function(element) {
                // Use the compile function from the RecursionHelper,
                // And return the linking function(s) which it returns
                return RecursionHelper.compile(element);
            },
            controller:['$scope','$rootScope',function($scope,$rootScope){
                $scope.maxChields = config.limitOfVisibleChilds;
                
                $scope.Math = window.Math;
                
                $scope.expandToggle = function($event){
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.node.toggleExpand();
                };
                $scope['arrow-style'] = {};
                
                $scope.$watch('node._x + node._y',function(){
                    $scope.arrowStyle = {};
                    
                    if( $scope.node ){
                        
                        var hasChild = $scope.node._childs.length > 0;
                        if($scope.node._x < 0 ){
                            $scope.arrowStyle.width = (-$scope.node._x)+'px';
                            $scope.arrowStyle.left  = '50%';
                            $scope.arrowStyle.top   = (-$scope.node._y+80+10 + (hasChild?-4:-1))+'px';
                            $scope.arrowStyle.height= ($scope.node._y-80-10-10 + (hasChild?0:1))+'px';
                            $scope.arrowStyle['border-right-style'] = 'none';
                        } else {
                            $scope.arrowStyle.width = ($scope.node._x)+'px';
                            $scope.arrowStyle.right  = '50%';
                            $scope.arrowStyle.top   = (-$scope.node._y+80+10 + (hasChild?-4:-1))+'px';
                            $scope.arrowStyle.height= ($scope.node._y-80-10-10 + (hasChild?0:1))+'px';
                            $scope.arrowStyle['margin-right']= '-1px';
                            $scope.arrowStyle['border-left-style'] = 'none';

                        }
                    }
                });
            }],
            replace: true
        };
    }])
    .directive('tbTreeViewArrow',function(){
        return{
            template:
                '<div class="tb-tree-view-arrow">' +
                    '<div ng-repeat="chunk in chunks" ng-class="chunk.class"></div>'+
                '</div>',
            restrict: "A",
            scope:{
                from:'=',
                to:'=',
                blockSize:'@'
            },
            controller:['$scope',function($scope){
                var calcChunks = function(){
                    $scope.chunks = [];
                    
                    var from = {
                        top: $scope.from._y - $scope.blockSize.h /2,
                        bottom: $scope.from._y + $scope.blockSize.h /2,
                        left: $scope.from._x - $scope.blockSize.w /2,
                        right: $scope.from._x + $scope.blockSize.w /2,
                        x:$scope.from._x,
                        y:$scope.from._y
                    };
                    
                    var to = {
                        top: $scope.to._y - $scope.blockSize.h /2,
                        bottom: $scope.to._y + $scope.blockSize.h /2,
                        left: $scope.to._x - $scope.blockSize.w /2,
                        right: $scope.to._x + $scope.blockSize.w /2,
                        x:$scope.to._x,
                        y:$scope.to._y
                    };
                };
                
                $scope.$watch('from._x + from._y + to._x + to._y + blockSize.w + blockSize.h',calcChunks);
            }]
        }
    });