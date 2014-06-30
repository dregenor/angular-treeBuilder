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
            this._lastId = 0;
            
            Object.keys(_nodeList).forEach(function(key){
                key = parseInt(key,10);
                if( key > this._lastId ){
                    this._lastId = key;
                }
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
         * @param {{x:Number,y:Number}} start
         */
        builder.prototype.calcPositions = function(offset,start){
            
            this.cleanDeadNodes();
            var o = angular.extend({x:2,y:1},offset||{});
            
            treeSeeker(this._treeRoot,start, o);
            // all nodes have positions
        };

        /**
         * clean nodes in ded branches
         */
        builder.prototype.cleanDeadNodes = function(){
            var liveList  = []; 
            treeSeeker3(this._treeRoot,this.items,liveList);
           
            var dirtyItems = this.items;
            this.items = {};
            liveList.forEach(function(key){
                this.items[key] =  dirtyItems[key];
            }.bind(this)); 
        };
        
        builder.prototype.getNextId = function(){
            return ++this._lastId;
        };

        /**
         * Заменяет ноду
         * @param node
         * @param target
         */
        builder.prototype.replaceNode = function(node,target){
            if(!target instanceof TreeNode){
                throw new Error('target must be instance of TreeNode');
            }
            var parent = target._parent,
                itm = TreeNode.create(node,node.id); 
            if(parent instanceof TreeNode){
               parent.removeChild(target);
               delete this.items[target._id];
               itm.setParent(parent);
               this.items[itm._id] = itm; 
            } else if (parent == null){
               this._treeRoot = itm; 
               delete this.items[target._id];
               this.items[itm._id] = itm; 
            }
            return itm;
        };
        
        /**
         * Заменяет ноду
         * @param node
         * @param target
         */
        builder.prototype.addNode = function(node,target){
            var itm = TreeNode.create(node,node.id);
            if(target){
               itm.setParent(target);
               this.items[itm._id] = itm; 
            }
            return itm;
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
        
        
        var treeSeeker2 = function(objList,offset){
            Object.keys(objList).forEach(function(key){
                var node = objList[key];
                var children = node.getChildren();
                var l = children.length;
                if (l>0){
                    children.forEach(function(itm,index){
                        itm.setPos({x: offset.x*(index - (l - 1)/2), y:offset.y});
                    })
                }
            })
        };
        
        var treeSeeker3 = function( node ,list, finded ){
            if (list[node._id]){
                finded.push(node._id)
            }
            node._childs.forEach(function(node){
                treeSeeker3(node,list,finded)
            })
        };
        
        return builder;
    });