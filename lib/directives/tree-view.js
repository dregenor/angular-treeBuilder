angular.module('tree-builder.directives')
    .directive('tbTreeView',['RecursionHelper','tree-builder.config',function(RecursionHelper,config){
        return{
            template: 
                '<div class="tb-tree-view_node" style="left:{{node._x}}px;top:{{node._y}}px"' +
                        'ng-class="{expanded:node.expanded,has_childs:node._childs.length}" ' +
                        'ng-click="expandToggle($event)" ng-mousedown="down($event)" ng-mouseup="up($event)"' +
                '>' +
                    '<div ng-if="node._parent" class="connection-line" ng-style="arrowStyle"></div>' +
                    '<span class="node-block_title">{{node.title}}</span>'+
                    '<span class="node-block_description">{{node.description}}</span>'+
                    
                    '<div class="node-layer" ng-if="node.expanded && node._childs.length > 0 && node._childs.length < maxChields">' +
                        '<div class="node-child" tb-tree-view node="child" ng-repeat="child in node._childs" ' +
                        '></div>' +
                    '</div>'+
                    '<div ng-if="node.expanded && node._childs.length>=maxChields" class="many-child tb-tree-view_node node-layer" ng-mousedown="prevent($event)">' +
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
            controller:['$scope',function( $scope ){
                $scope.maxChields = config.limitOfVisibleChilds;
                
                $scope.Math = window.Math;
                
                $scope.expandToggle = function($event){
                    
                    $event.preventDefault();
                    $event.stopPropagation();
                    if($scope.catch){
                        $scope.catch = false;
                    } else {
                        $scope.node.toggleExpand();                    
                    }
                };
                $scope['arrow-style'] = {};
                
                $scope.$watch('node._x + node._y',function(){
                    $scope.arrowStyle = {};
                    
                    if( $scope.node ){
                        var hasChild = $scope.node._childs.length > 0,
                            h = config.size.h + (hasChild?-4:-1),
                            dl = config.downLineLength,
                            ofs = (hasChild?0:3);
                        if($scope.node._x < 0 ){
                            $scope.arrowStyle.width = (-$scope.node._x + ofs)+'px';
                            $scope.arrowStyle.left  = '50%';
                            $scope.arrowStyle.top   = (-$scope.node._y + h + dl )+'px';
                            $scope.arrowStyle.height= ($scope.node._y - h - dl - 1)+'px';
                            $scope.arrowStyle['border-right-style'] = 'none';
                        } else {
                            $scope.arrowStyle.width = ($scope.node._x - ofs)+'px';
                            $scope.arrowStyle.right  = '50%';
                            $scope.arrowStyle.top   = (-$scope.node._y + h + dl)+'px';
                            $scope.arrowStyle.height= ($scope.node._y - h - dl - 1 ) + 'px';
                            $scope.arrowStyle['margin-right']= '-1px';
                            $scope.arrowStyle['border-left-style'] = 'none';

                        }
                    }
                });
                
                $scope.down = function(evt){
                    if (evt.which == 1 && $scope.node._parent){
                        $scope.pos = {
                            x:$scope.node._x - evt.x,
                            y:$scope.node._y - evt.y
                        };
                        
                        evt.stopPropagation();
                        angular.element(window).on('mousemove',function(evt){
                            $scope.catch = true;
                            evt.preventDefault();
                            var y = $scope.pos.y + evt.y;
                            y = y>config.offset.y?y:config.offset.y;
                            $scope.node.setPos({
                                x:  $scope.pos.x + evt.x, 
                                y:  y 
                            });
                            $scope.$apply('node');
                        });
                        angular.element(window).on('mouseup',$scope.up);    
                    }
                    
                };
                
                $scope.up = function(evt){
                    angular.element(window).off('mousemove');
                    if($scope.node.checkForNewParent(config.near)){
                        $scope.$emit('tree-changed');
                    }
                };
                
                $scope.prevent = function(evt){
                    evt.preventDefault();
                    evt.stopPropagation();
                }
                
            }],
            replace: true
        };
    }]);