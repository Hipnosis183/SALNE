angular.module('autorVer')
    .component('autorVer', {
        templateUrl: 'core/autores/autor-ver/autor-ver.template.html',
        controller: function ($http, $location, $rootScope, $routeParams, $scope) {
            $scope.autor = {};
            // Conseguir la información del autor.
            $http.get(
                $rootScope.env.apiServer + "autor",
                { params: { id: $routeParams.id } })
                .then(function (response) {
                    $scope.autor = response.data.autor;
                    $scope.libros = response.data.libros;
                });

            // Editar el autor seleccionado.
            $scope.autorEditar = function () {
                $location.path($location.path() + '/autorEditar');
            }

            // Eliminar el autor seleccionado.
            $scope.autorBorrar = function () {
                $rootScope.showConfirm("¿Está seguro que quiere eliminar este autor?")
                .then(function () {
                    $http.post(
                        $rootScope.env.apiServer + "autorBorrar",
                        { id: $routeParams.id })
                        .then(function (response) {
                            if (response.status === 200) { $rootScope.goBack(); }
                            else { $rootScope.showError("No se ha podido eliminar el autor," +
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
                if ($scope.autor.imagen) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "autores/" + $scope.autor.imagen + "?v" + $scope.autor.__v;
                }
            }
        }
    });