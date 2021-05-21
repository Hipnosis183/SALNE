angular.module('generoEditar')
    .component('generoEditar', {
        templateUrl: 'core/generos/genero-editar/genero-editar.template.html',
        controller: function ($http, $rootScope, $routeParams, $scope) {
            $scope.genero = {};
            // Conseguir la información del género.
            $http.get(
                $rootScope.env.apiServer + "genero",
                { params: { id: $routeParams.id } })
                .then(function (response) { $scope.genero = response.data.genero; });

            // Editar el género seleccionado.
            $scope.generoEditar = function () {
                // Crear y armar nuevo formulario.
                var generoForm = new FormData();
                generoForm.append('id', $scope.genero.id);
                generoForm.append('version', $scope.genero.__v + 1);
                generoForm.append('nombre', $scope.genero.nombre);
                generoForm.append('formato', $scope.genero.formato);
                // Limitado a un solo archivo.
                // No se pueden seleccionar los archivos de forma dinámica en AngularJS.
                generoForm.append('imagen', document.getElementById("imagen").files[0]);

                // Configurar petición HTTP y enviar formulario.
                if ($scope.generoForm.$valid) {
                    $http.post(
                        $rootScope.env.apiServer + "generoEditar", generoForm, {
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

            // Buscar imagen en el servidor.
            $scope.getImage = function () {
                if ($scope.genero.imagen) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "generos/" + $scope.genero.imagen + "?v" + $scope.genero.__v;
                }
            }
        }
    });