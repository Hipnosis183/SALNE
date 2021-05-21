angular.module('generoNuevo')
    .component('generoNuevo', {
        templateUrl: 'core/generos/genero-nuevo/genero-nuevo.template.html',
        controller: function ($http, $rootScope, $scope) {
            $scope.genero = {};
            // Crear un género nuevo con los datos ingresados.
            $scope.generoNuevo = function () {
                // Crear y armar nuevo formulario.
                var generoForm = new FormData();
                generoForm.append('nombre', $scope.genero.nombre);
                // Limitado a un solo archivo.
                // No se pueden seleccionar los archivos de forma dinámica en AngularJS.
                generoForm.append('imagen', document.getElementById("imagen").files[0]);

                // Configurar petición HTTP y enviar formulario.
                if ($scope.generoForm.$valid) {
                    $http.post(
                        $rootScope.env.apiServer + "generoNuevo", generoForm, {
                            // Atributos necesarios para el envio de archivos.
                            transformRequest: angular.identity,
                            headers: { 'Content-Type': undefined }
                        })
                        .then(function (response) {
                            if (response.status === 200) { $rootScope.goBack(); }
                            else { $rootScope.showError(); }
                        });
                }
            }
        }
    });