angular.module('tree-builder')
    .factory('TreeNodeCalculator',[function(){

        /**
         * {TreeNode} this
         */
        var calc = function(sum){
            
            var result = sum || 0,
                val = this.val;
            
            var top = this._parent?this._parent.class:'default';
            
            switch (top+'_'+this.class){
                case 'blue_green':
                case 'green_blue':
                case 'yellow_yellow':
                    result -= val;
                    break;
                default:
                    result += val;
                    break;
            }
            
            this._childs.forEach(function(item){
                result = calc.call(item,result);
            });
            
            return result;
        };
        
        
        return function(node){
            return calc.call(node);
        }
    }]);