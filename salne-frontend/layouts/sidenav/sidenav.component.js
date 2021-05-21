angular.module('sideNav')
    .component('sideNav', {
        templateUrl: 'layouts/sidenav/sidenav.template.html',
        controller: function ($location, $scope, $rootScope) {
            // Direcciones de enrutamiento para los botones.
            $scope.ingresar = function () {
                $location.path('/ingresar');
            }
            $scope.registrarse = function () {
                $location.path('/registrarse');
            }
            $scope.carrito = function () {
                $location.path('/carrito');
            }
            $scope.cuenta = function () {
                $location.path('/usuarios/' + $rootScope.usuarioSesion._id);
            }

            // Iterar por todos los botones hasta encontrar el correspondiente para la ruta.
            $scope.setButtons = function () {
                // Definir los botones en la barra de navegación.
                $scope.sidenavElements = [
                    document.getElementById("sidenav-inicio"),
                    document.getElementById("sidenav-ingresar"),
                    document.getElementById("sidenav-registrarse"),
                    document.getElementById("sidenav-cuenta"),
                    document.getElementById("sidenav-carrito"),
                    document.getElementById("sidenav-libros"),
                    document.getElementById("sidenav-autores"),
                    document.getElementById("sidenav-generos")
                ]
                // Definir las rutas correspondientes a los botones.
                $scope.sidenavUrls = [
                    "inicio",
                    "ingresar",
                    "registrarse",
                    "usuarios",
                    "carrito",
                    "libros",
                    "autores",
                    "generos"
                ]

                // Iterar por todos los botones hasta encontrar el correspondiente para la ruta.
                for (var i = 0; i < $scope.sidenavUrls.length; i++) {
                    if (window.location.href.indexOf($scope.sidenavUrls[i]) != -1) {
                        for (var k = 0; k < $scope.sidenavElements.length; k++) {
                            if (i === k) { angular.element($scope.sidenavElements[k]).addClass("active"); }
                            else { angular.element($scope.sidenavElements[k]).removeClass("active"); }
                        } return;
                    // Identificar la página de inicio, que no tiene una ruta específica.
                    } else if (i === $scope.sidenavUrls.length - 1) {
                        angular.element($scope.sidenavElements[0]).addClass("active");
                        for (var k = 1; k < $scope.sidenavElements.length; k++) {
                            angular.element($scope.sidenavElements[k]).removeClass("active");
                        } return;
                    }
                }
            };

            // Listener para determinar cuando la página haya cargado y esté lista.
            angular.element(function () {
                $scope.setButtons();
            });
            
            // Listener para el cambio de rutas.
            $scope.$on('$locationChangeSuccess', function(event, next, current) {
                $scope.setButtons();
            });
        }
    });