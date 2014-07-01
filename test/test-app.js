var mockupResponce = {
    total:10,
    data:[
        {id:1,val:1,class:'blue',parentId:null},
        {id:2,val:0,class:'empty',parentId:1}
    ]
};

angular.module('app',['tree-builder'])
    .run(['tree-builder.config',function(config){
        config.limitOfVisibleChilds = 4;
    }])
    .controller('main',[
        '$scope',
        '$timeout',
        'tree-builder.services.builder',
        'TreeNodeCalculator',
        function($scope, $timeout, tBuilder,calculator){
        //let's assume that the data come to us from the server asynchronously
        $timeout(function(){
            // prepare data to tBuild
            $scope.tree = new tBuilder(
                mockupResponce.data.reduce(function(tail,itm){
                    tail[itm.id] = itm;
                    return tail;
                },{})
            );
            
            $scope.calcPos = $scope.tree.calcPositions.bind($scope.tree,{x:100,y:100},{x:0,y:0});
            $scope.calcPos();
            $scope.$on('tree-changed',function(){
                $scope.tree.cleanDeadNodes();
                $scope.calcVal();
                $scope.restoreEmpty();
                $scope.calcPos();
            });
        },100);
            
        $scope.calcVal = function(){
            $scope.val = calculator($scope.tree._treeRoot)
        };
            
        $scope.restoreEmpty = function(){
            $scope.tree.makeFinishNode({
                val:0,
                class:'empty'
            },function(elem){
                if (elem.class === 'green'){
                    return  elem._childs.length < 2;
                } else if( elem.class === 'empty' ){
                    return false;
                } else {
                    return  elem._childs.length < 1;
                }
            });
        };    
            
        $scope.startDrag = function(){};    
            
        $scope.examples = [];
            
            
        var colors = ['blue','yellow','green','red'];
        for(var i = 0; i < 10; i++ ){
            var itm = {};
            itm._y = Math.floor( i / 3) * 100;
            itm._x = i % 3 * 100;
            itm.class = colors[Math.floor(i/3)];
            itm.val = i+1;
            $scope.examples.push(itm);
        }   
            
        $scope.createModel = function(item){
            $scope.$dropmodel = angular.copy(item);
        }    
            
        $scope.tree = null;
    }]);