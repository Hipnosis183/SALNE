angular.module('generoLista')
    .component('generoLista', {
        templateUrl: 'core/generos/genero-lista/genero-lista.template.html',
        controller: function ($http, $rootScope, $scope) {
            // Conseguir la información de los géneros.
            $http.get($rootScope.env.apiServer + "genero")
                .then(function (response) { $scope.generos = response.data; });

            // Buscar imagen en el servidor.
            $scope.getImage = function (genero) {
                if (genero) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "generos/" + genero.imagen + "?v" + genero.__v;
                }
            }
        }
    });