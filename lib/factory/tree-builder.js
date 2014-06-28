var TreeNode = require('./treeNode');

angular.module('tree-builder.services')
    .factory('tree-builder.services.builder',function(){
        /**
         * @constructor
         * @param {Object} data
         */
        var builder = function(data){
            
            var _nodeList = this.items = angular.copy(data);
            
            this._treeRoot =  null;
            Object.keys(_nodeList).forEach(function(key){
                
                var treeNode = _nodeList[key] = TreeNode.create(_nodeList[key],key);
                
                var parentNode = _nodeList[treeNode.parentId];
                
                if (!parentNode){
                    // current treeNode - root
                    this._treeRoot = treeNode;
                } else {
                    // cast parentNode to TreeNode type
                    parentNode = TreeNode.create(parentNode,treeNode.parentId);
                    // bundle node in tree
                    treeNode.setParent(parentNode);
                }
            }.bind(this));
            
            // now tree is ready and this._treeRoot is pointer to super parent node
            
            
        };

        /**
         * calculate offset
         * @param {{x:Number,y:Number}} offset
         */
        builder.prototype.calcPositions = function(offset){
            var o = angular.extend({x:2,y:1},offset||{});
            
            var cursor = this._treeRoot;
            
            treeSeeker(cursor,{x:0,y:0},o);
            // all nodes have positions
        };

        /**
         * iterate all node in tree and calc it positions
         * @param {treeNode} obj
         * @param {{x:Number,y:Number}} start
         * @param {{x:Number,y:Number}} offset
         * @return {{x: Number, y: Number}}
         */
        var treeSeeker = function(obj,start,offset){
            obj.setPos(start);

            var pos = {x:start.x,y:start.y},
                arr = obj.getChildren();
            
            if(arr.length > 0){
                var nextLevelPos = {
                    x:pos.x,
                    y:pos.y + offset.y
                };
                arr.forEach(function(itm){
                    nextLevelPos = treeSeeker(itm,nextLevelPos,offset)
                });
                pos.x = nextLevelPos.x;
            } else {
                pos.x += offset.x;
            }
            // feedback fix position
            if(pos.x > start.x + offset.x){
                obj.setPos({
                    x:start.x + Math.round((pos.x - start.x - offset.x)*0.5),
                    y:start.y
                });
            }
            
            return pos;
        };
        
        return builder;
    });