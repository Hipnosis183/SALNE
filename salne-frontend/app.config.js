angular.module('salneApp')
    .config(['$routeProvider', function config($routeProvider) {
            $routeProvider.when('/', {
                template: '<inicio></inicio>'
            }).when('/ingresar', {
                template: '<sesion-ingresar></sesion-ingresar>'
            }).when('/carrito', {
                template: '<sesion-carrito></sesion-carrito>'
            }).when('/registrarse', {
                template: '<usuario-nuevo></usuario-nuevo>'
            }).when('/usuarios/:id/usuarioEditar', {
                template: '<usuario-editar></usuario-editar>'
            }).when('/usuarios/:id', {
                template: '<usuario-ver></usuario-ver>'
            }).when('/libros', {
                template: '<libro-lista></libro-lista>'
            }).when('/libros/libroNuevo', {
                template: '<libro-nuevo></libro-nuevo>',
                resolve: { loggedIn: function ($rootScope) { return $rootScope.reqAdmin() } }
            }).when('/libros/:id/libroEditar', {
                template: '<libro-editar></libro-editar>',
                resolve: { loggedIn: function ($rootScope) { return $rootScope.reqAdmin() } }
            }).when('/libros/:id', {
                template: '<libro-ver></libro-ver>'
            }).when('/autores', {
                template: '<autor-lista></autor-lista>'
            }).when('/autores/autorNuevo', {
                template: '<autor-nuevo></autor-nuevo>',
                resolve: { loggedIn: function ($rootScope) { return $rootScope.reqAdmin() } }
            }).when('/autores/:id/autorEditar', {
                template: '<autor-editar></autor-editar>',
                resolve: { loggedIn: function ($rootScope) { return $rootScope.reqAdmin() } }
            }).when('/autores/:id', {
                template: '<autor-ver></autor-ver>'
            }).when('/generos', {
                template: '<genero-lista></genero-lista>'
            }).when('/generos/generoNuevo', {
                template: '<genero-nuevo></genero-nuevo>',
                resolve: { loggedIn: function ($rootScope) { return $rootScope.reqAdmin() } }
            }).when('/generos/:id/generoEditar', {
                template: '<genero-editar></genero-editar>',
                resolve: { loggedIn: function ($rootScope) { return $rootScope.reqAdmin() } }
            }).when('/generos/:id', {
                template: '<genero-ver></genero-ver>'
            }).otherwise('/');
        }
    ]);

angular.module('salneApp')
    .config(function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    });