angular.module('libroLista')
    .component('libroLista', {
        templateUrl: 'core/libros/libro-lista/libro-lista.template.html',
        controller: function ($http, $rootScope, $scope) {
            // Conseguir la información de los libros.
            $http.get($rootScope.env.apiServer + "libro")
                .then(function (response) { $scope.libros = response.data; });

            // Buscar imagen en el servidor.
            $scope.getImage = function (libro) {
                if (libro) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "libros/" + libro.imagen + "?v" + libro.__v;
                }
            }
        }
    });