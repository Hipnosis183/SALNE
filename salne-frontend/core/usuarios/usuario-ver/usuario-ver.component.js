angular.module('usuarioVer')
    .component('usuarioVer', {
        templateUrl: 'core/usuarios/usuario-ver/usuario-ver.template.html',
        controller: function ($http, $location, $rootScope, $routeParams, $scope) {
            $scope.usuario = {};
            // Conseguir la información del usuario.
            $http.get(
                $rootScope.env.apiServer + "usuario",
                { params: { id: $routeParams.id } })
                .then(function (response) { $scope.usuario = response.data; });

            // Editar el usuario actual.
            $scope.usuarioEditar = function () {
                $location.path($location.path() + '/usuarioEditar');
            }

            // Eliminar el usuario actual.
            $scope.usuarioBorrar = function () {
                $rootScope.showConfirm("¿Está seguro que quiere eliminar su cuenta?")
                .then(function () { $rootScope.salir(); })
                .then(function () {
                    $http.post(
                        $rootScope.env.apiServer + "usuarioBorrar",
                        { id: $routeParams.id })
                        .then(function (response) {
                            if (response.status === 200) { $rootScope.goBack(); }
                            else { $rootScope.showError("No se ha podido eliminar la cuenta."); }
                        });
                }, function (/* Evitar alertas y errores en consola */) {});
            }

            // Buscar imagen en el servidor.
            $scope.getImage = function (libro) {
                if (libro) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "libros/" + libro.imagen + "?v" + libro.__v;
                }
                if ($scope.usuario.imagen) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "usuarios/" + $scope.usuario.imagen + "?v" + $scope.usuario.__v;
                }
            }
        }
    });