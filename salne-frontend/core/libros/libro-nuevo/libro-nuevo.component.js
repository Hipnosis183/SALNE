angular.module('libroNuevo')
    .component('libroNuevo', {
        templateUrl: 'core/libros/libro-nuevo/libro-nuevo.template.html',
        controller: function ($http, $rootScope, $scope) {
            $scope.libro = {};
            // Conseguir las listas de autores y géneros.
            $http.get($rootScope.env.apiServer + "libroNuevo")
                .then(function (response) {
                    $scope.autores = response.data.autores;
                    $scope.generos = response.data.generos;
                    // Necesario para que los select no tengan valores sin definir.
                    $scope.libro.autor = $scope.autores[0]._id;
                    $scope.libro.genero = $scope.generos[0]._id;
                });

            // Crear un libro nuevo con los datos ingresados.
            $scope.libroNuevo = function () {
                // Crear y armar nuevo formulario (no usamos el formulario ya existente
                // porque los campos autor y genero no conservan el formato adecuado).
                var libroForm = new FormData();
                libroForm.append('titulo', $scope.libro.titulo);
                libroForm.append('descrip', $scope.libro.descrip);
                libroForm.append('autor', $scope.libro.autor);
                libroForm.append('edicion', $scope.libro.edicion);
                libroForm.append('ano', $scope.libro.ano);
                libroForm.append('genero', $scope.libro.genero);
                libroForm.append('isbn', $scope.libro.isbn);
                // Limitado a un solo archivo.
                // No se pueden seleccionar los archivos de forma dinámica en AngularJS.
                libroForm.append('imagen', document.getElementById("imagen").files[0]);

                // Configurar petición HTTP y enviar formulario.
                if ($scope.libroForm.$valid) {
                    $http.post(
                        $rootScope.env.apiServer + "libroNuevo", libroForm, {
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