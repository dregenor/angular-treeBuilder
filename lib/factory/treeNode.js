/**
 * @constructor
 * @type {treeNode}
 */
var treeNode = function(data,id){
    angular.extend(this,data);
    this._childs = [];
    this._x = 0;
    this._y = 0;
    this._id = id;
};

module.exports = treeNode;

/**
 * @factory
 * @param itm
 * @return {*}
 */
treeNode.create = function(itm,id){
    if (itm instanceof treeNode){
        return itm;
    } else {
        return new treeNode(itm,id);
    }
};

/**
 * 
 * @param {{x:Number, y:Number}} pos
 */
treeNode.prototype.setPos = function(pos){
    this._x = pos.x;
    this._y = pos.y;
};

/**
 * bundle node
 * @param {treeNode} newParent
 */
treeNode.prototype.setParent = function(newParent){
    if (this._parent){
        this._parent.removeChild(this);
    }
    newParent.addChild(this);
    this._parent = newParent;
};


/**
 * @memberOf treeNode
 * return array of childs
 * @return {Array.<treeNode>}
 */
treeNode.prototype.getChildren = function(){
    return this._childs;
};


/**
 * add child
 * @param {treeNode} itm
 */
treeNode.prototype.addChild = function(itm){
    this._childs.push(itm);
};

/**
 * remove child item
 * @param {treeNode} itm
 */
treeNode.prototype.removeChild = function(itm){
    var pos = this._childs.indexOf(itm);
    if(pos>=0){
        this._childs.splice(pos,1);
    }
    return itm;
};

treeNode.prototype.toJSON = function(){
    return Object.keys(this).reduce(function(tail,key){
        if (key[0] == '_'){
            return tail;
        }
        tail[key] = this[key];
        return tail;
    }.bind(this),{})    
};