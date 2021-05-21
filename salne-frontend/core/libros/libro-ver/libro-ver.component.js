angular.module('libroVer')
    .component('libroVer', {
        templateUrl: 'core/libros/libro-ver/libro-ver.template.html',
        controller: function ($cookies, $http, $location, $rootScope, $routeParams, $scope) {
            $scope.libro = {};
            // Conseguir la información del libro.
            $http.get(
                $rootScope.env.apiServer + "libro",
                { params: { id: $routeParams.id } })
                .then(function (response) { $scope.libro = response.data; });

            // Editar el libro seleccionado.
            $scope.libroEditar = function () {
                $location.path($location.path() + '/libroEditar');
            }

            // Eliminar el libro seleccionado.
            $scope.libroBorrar = function () {
                $rootScope.showConfirm("¿Está seguro que quiere eliminar este libro?")
                .then(function () {
                    $http.post(
                        $rootScope.env.apiServer + "libroBorrar",
                        { id: $routeParams.id })
                        .then(function (response) {
                            if (response.status === 200) { $rootScope.goBack(); }
                            else { $rootScope.showError("No se ha podido eliminar el libro," +
                                " ya que este se encuentra en la biblioteca de uno o más clientes."); }
                        });
                }, function (/* Evitar alertas y errores en consola */) {});
            }
            
            // Comprobar si el libro se encuentra en la biblioteca del usuario actual.
            $scope.enBiblioteca = function () {
                if ($rootScope.usuarioSesion) {
                    return ($rootScope.usuarioSesion.libros.indexOf($routeParams.id) != -1) ? true : false;
                } else { return false; }
            }
            
            // Comprobar si el libro se encuentra en el carrito de la sesión actual.
            $scope.carritoExiste = function () {
                var carritoUsuario = [];
                if ($cookies.getObject('carrito')) { carritoUsuario = $cookies.getObject('carrito'); }
                if (carritoUsuario.includes($routeParams.id)) { return true; }
                else { return false; }
            }

            // Añadir el libro al carro de compras de la sesión actual.
            $scope.carritoAnadir = function () {
                var carritoUsuario = [];
                if ($cookies.getObject('carrito')) { carritoUsuario = $cookies.getObject('carrito'); }
                if (!carritoUsuario.includes($routeParams.id)) {
                    carritoUsuario.push($routeParams.id);
                    $cookies.putObject('carrito', carritoUsuario);
                }
                $location.path('/carrito');
            }

            // Eliminar el libro del carro de compras de la sesión actual.
            $scope.carritoEliminar = function () {
                var carritoUsuario = [];
                if ($cookies.getObject('carrito')) { carritoUsuario = $cookies.getObject('carrito'); }
                if (carritoUsuario.includes($routeParams.id)) {
                    carritoUsuario.splice(carritoUsuario.indexOf($routeParams.id), 1);
                    $cookies.putObject('carrito', carritoUsuario);
                }
                $location.path('/carrito');
            }

            // Buscar imagen en el servidor.
            $scope.getImage = function () {
                if ($scope.libro.imagen) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "libros/" + $scope.libro.imagen + "?v" + $scope.libro.__v;
                }
            }
        }
    });