
// its only for test you can remove this string and use angular from google-cdn by 
// <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular.min.js"></script>
require('angular');

require('./directives');
require('./factory');
require('./helpers/requrseHelper');
require('./helpers/dragAndDrop');

angular.module('tree-builder',['tree-builder.services','tree-builder.directives','draganddrop']);
require('./config');
require('./helpers/treeNodeCalculator');

