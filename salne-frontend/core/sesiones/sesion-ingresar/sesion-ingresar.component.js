angular.module('sesionIngresar')
    .component('sesionIngresar', {
        templateUrl: 'core/sesiones/sesion-ingresar/sesion-ingresar.template.html',
        controller: function ($http, $rootScope, $scope) {
            $scope.ingresar = function () {
                // Revisar que el formulario sea válido.
                if ($scope.sesionForm.$valid) {
                    // Configurar petición HTTP y enviar formulario.
                    $http.post($rootScope.env.apiServer + "iniciarSesion", $scope.sesion)
                        .then(function (response) {
                            if (response.status === 200) { $rootScope.iniciar(); $rootScope.goBack(); }
                            else { $rootScope.showError("El usuario no existe."); }
                        });
                }
            }
        }
    });