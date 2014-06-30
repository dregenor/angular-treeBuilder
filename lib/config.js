/**
 * Created by dreg on 29.06.14.
 */
angular.module('tree-builder')
    .factory('tree-builder.config',function(){
        var config = {
            limitOfVisibleChilds:4,
            offset:{
              x:200,  
              y:120
            },
            size:{
              h:80,
              w:180
            },
            downLineLength:10,
            near:20,
            border:{
                hasChild:4,
                noChild:1
            }
        };
        return config;
    });