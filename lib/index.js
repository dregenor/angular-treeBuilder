
// its only for test you can remove this string and use angular from google-cdn by 
// <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular.min.js"></script>
require('angular/lib/angular.js');

require('./directives');
require('./factory');

angular.module('tree-builder',['tree-builder.services','tree-builder.directives']);

