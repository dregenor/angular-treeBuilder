/**
 * Created by dreg on 29.06.14.
 */
angular.module('tree-builder')
    .factory('tree-builder.config',function(){
        var config = {
            limitOfVisibleChilds:4
        };
        return config;
    });