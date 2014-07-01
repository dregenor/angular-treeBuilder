//var TreeNode = require('../factory/treeNode');
angular.module('tree-builder.directives')
    .directive('tbTreeView2',[function(){
        return{
            template: 
                '<div class="tb-tree-view2">' +
                    '<div ' +
                        'ng-repeat="node in tree.items" ' +
                        'tb-node node="node" ' +
                        'drop="onDrop($data, $event, node)" ' +
                        'drop-effect="copy" ' +
                        'drop-accept="\'json/custom-object\'" ' +
                        'draggable="true"' +
                        'effect-allowed="copy"' +
                        'draggable-type="custom-object"' +
                        'draggable-data="node"'+
                    '></div>'+
                '</div>',
            restrict: "A",
            scope:{
                'tree':'='
            },
            controller:['$scope',function($scope){
                
                var empty = {
                    val:0,
                    class:'empty'
                };
                
                $scope.onDrop = function($data,$event,targetNode){
                    var target = targetNode;
                    if(target){
                        var data = $data['json/custom-object'],
                            fromTree = data.id;
                        var node = angular.extend({id:$scope.tree.getNextId()},data);
                        
                        node = $scope.tree.replaceNode(node,target);
                        
                        if(!fromTree){
                            var emptyNode = angular.extend({id:$scope.tree.getNextId()},empty);
                            $scope.tree.addNode(emptyNode,node);
                            if(node.class == "green"){
                                emptyNode = angular.extend({id:$scope.tree.getNextId()},empty);
                                $scope.tree.addNode(emptyNode,node);
                            }    
                        } 
                    }
                    $scope.$emit('tree-changed');
                }
            }],
            replace: true
        };
    }])
    .directive('tbNode',[function(){
        return{
            template: 
                '<div class="tb-node id_{{node.id}}" style="left:{{node._x}}px;top:{{node._y}}px" ng-class="node.class">' +
                    '<div ng-if="node._parent" class="connection-line" ng-style="arrowStyle"></div>' +
                    '<span class="tb-node_value">{{node.val}}</span>'+
                '</div>',
            restrict: "A",
            scope:{
                'node':'='
            },
            controller:['$scope',function( $scope ){
                
                $scope['arrow-style'] = {};
                
                $scope.$watch('node._x + node._y',function(){
                     var style = {};
                    
                    if( $scope.node && $scope.node._parent){
                        // calc arrow style
                        var px = $scope.node._parent._x,  
                            py = $scope.node._parent._y,
                            cx = $scope.node._x,
                            cy = $scope.node._y,
                            w = Math.abs(px-cx),
                            h = Math.abs(py-cy)-60,
                            ox= px-cx;
                        style = {
                            width:w+'px',
                            height:h+'px'
                        };
                        if(ox>0){
                            style.borderRight = 'none';
                        } else {
                            style.borderLeft = 'none';
                            style.left = ox+'px';
                        }
                        
                    }
                    $scope.arrowStyle = style;
                });
            }],
            replace: true
        };
    }]);