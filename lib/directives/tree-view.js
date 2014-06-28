
angular.module('tree-builder.directives')
    .directive('tbTreeView',function(){
        return{
            template: 
                '<ul class="tb-tree-view">' +
                    '<li class="tb-tree-view_tree-node" ng-repeat="item in treeData.items" style="left:{{item._x}}px;top:{{item._y}}px; ">' +
                        '<span class="tree-node_title">{{item.title}}</span>'+
                        '<div class="tree-node_description">{{item.description}}</div>'+
                        '<span>pos:({{item._x}},{{item._y}})</span>'+
                    '</li>'+
                '</ul>',
            restrict: "A",
            transclude: true,
            scope:{
                "treeData":'='    
            },
            replace: true
        };
    });