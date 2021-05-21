angular.module('generoVer')
    .component('generoVer', {
        templateUrl: 'core/generos/genero-ver/genero-ver.template.html',
        controller: function ($http, $location, $rootScope, $routeParams, $scope) {
            $scope.genero = {};
            // Conseguir la información del género.
            $http.get(
                $rootScope.env.apiServer + "genero",
                { params: { id: $routeParams.id } })
                .then(function (response) {
                    $scope.genero = response.data.genero;
                    $scope.libros = response.data.libros;
                });

            // Editar el género seleccionado.
            $scope.generoEditar = function () {
                $location.path($location.path() + '/generoEditar');
            }

            // Eliminar el género seleccionado.
            $scope.generoBorrar = function () {
                $rootScope.showConfirm("¿Está seguro que quiere eliminar este género?")
                .then(function () {
                    $http.post(
                        $rootScope.env.apiServer + "generoBorrar",
                        { id: $routeParams.id })
                        .then(function (response) {
                            if (response.status === 200) { $rootScope.goBack(); }
                            else { $rootScope.showError("No se ha podido eliminar el género," +
                                " ya que este se encuentra en uso en uno o más libros."); }
                        });
                }, function (/* Evitar alertas y errores en consola */) {});
            }

            // Buscar imagen en el servidor.
            $scope.getImage = function (libro) {
                if (libro) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "libros/" + libro.imagen + "?v" + libro.__v;
                }
                if ($scope.genero.imagen) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "generos/" + $scope.genero.imagen + "?v" + $scope.genero.__v;
                }
            }
        }
    });