var mockupResponce = {
    total:10,
    data:[
        {id:1,title:'Root',description:'it is root',parentId:null,expanded:true},
        
        {id:2,title:'fstLevelChild1',description:'it is root.child',parentId:1},
        {id:3,title:'fstLevelChild2',description:'it is root.child',parentId:1},
        {id:4,title:'fstLevelChild3',description:'it is root.child',parentId:1},
        
        {id:5,title:'fstLevelChild4',description:'it is fstLevelChild1.child',parentId:2},
        {id:6,title:'secLevelChild1',description:'it is fstLevelChild1.child',parentId:2},
        
        {id:7,title:'secLevelChild2',description:'it is fstLevelChild2.child',parentId:3},
        {id:8,title:'secLevelChild3',description:'it is fstLevelChild2.child',parentId:3},
        
        {id:9,title:'secLevelChild4',description:'it is fstLevelChild4.child',parentId:4},
        {id:10,title:'secLevelChild5',description:'it is fstLevelChild4.child',parentId:4},
        {id:11,title:'secLevelChild6',description:'it is fstLevelChild4.child',parentId:4},
        {id:12,title:'secLevelChild7',description:'it is fstLevelChild4.child',parentId:4}
    ]
};

console.log(angular.module('tree-builder'));
//
//,
angular.module('app',['tree-builder'])
    .run(['tree-builder.config',function(config){
                config.limitOfVisibleChilds = 4;
    }])
    .controller('main',[
        '$scope',
        '$timeout',
        'tree-builder.services.builder',
        'tree-builder.config',
        function($scope, $timeout, tBuilder,config){

        
        //let's assume that the data come to us from the server asynchronously
        
        
        $timeout(function(){
            // prepare data to tBuild
            $scope.tree = new tBuilder(
                mockupResponce.data.reduce(function(tail,itm){
                    tail[itm.id] = itm;
                    return tail;
                },{})
            );
            
            
            $scope.tree.calcPositions(config.offset);
            
            console.log($scope.tree);
        },100);
            
        $scope.$on('tree-changed',function(){
            $scope.tree.calcPositions({
                x:200,
                y:120
            });    
        });
        
        $scope.tree = null;
        $scope.who = "friend";
    }]);