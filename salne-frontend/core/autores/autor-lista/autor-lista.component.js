angular.module('autorLista')
    .component('autorLista', {
        templateUrl: 'core/autores/autor-lista/autor-lista.template.html',
        controller: function ($http, $rootScope, $scope) {
            // Conseguir la información de los autores.
            $http.get($rootScope.env.apiServer + "autor")
                .then(function (response) { $scope.autores = response.data; });

            // Buscar imagen en el servidor.
            $scope.getImage = function (autor) {
                if (autor) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "autores/" + autor.imagen + "?v" + autor.__v;
                }
            }
        }
    });