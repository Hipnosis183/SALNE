angular.module('sesionCarrito')
    .component('sesionCarrito', {
        templateUrl: 'core/sesiones/sesion-carrito/sesion-carrito.template.html',
        controller: function ($cookies, $http, $scope, $rootScope) {
            // Comprobar si el carro de compras esta vacío o no.
            $scope.carritoVacio = true;
            if ($cookies.getObject('carrito')) {
                $scope.carritoVacio = !(Object.keys($cookies.getObject('carrito')).length != 0) ? true : false;
            }

            $scope.libros = [];
            // Conseguir la información de los libros en el carro de compras.
            if (!$scope.carritoVacio) {
                $http.get($rootScope.env.apiServer + "carrito")
                    .then(function (response) { $scope.libros = response.data; });
            }

            // Realizar compra de los libros en el carro de compras.
            $scope.realizarCompra = function () {
                $http.get($rootScope.env.apiServer + "realizarCompra")
                    .then(function (response) {
                        if (response.status === 200) { $rootScope.goMain(); }
                        else { $rootScope.showError(); }
                    });
            }
            
            // Buscar imagen en el servidor.
            $scope.getImage = function (libro) {
                if (libro) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "libros/" + libro.imagen + "?v" + libro.__v;
                }
            }
        }
    });