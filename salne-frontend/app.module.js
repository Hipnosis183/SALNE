var app = angular.module('salneApp', [
    'ngRoute',
    'ngCookies',
    'ngMaterial',
    'ngMessages',
    'modLayouts',
    'modInicio',
    'modLibros',
    'modAutores',
    'modGeneros',
    'modUsuarios',
    'modSesiones'
]);

app.run(function ($cookies, $http, $mdDialog, $q, $rootScope, $window) {
    // Inicializar la sesión de usuario.
    $rootScope.usuarioSesion = null;

    // Cargar las variables de entorno.
    $http.get('app.env.json')
        .then(function (response) { $rootScope.env = response.data; })
        // Intentar iniciar sesión automáticamente si se detectan cookies.
        .then(function () { if ($cookies.get('session')) { $rootScope.iniciar(); } });

    // Comprobar si el usuario de la sesión es administrador.
    $rootScope.reqAdmin = function () {
        if ($rootScope.usuarioSesion != null) {
            return ($rootScope.usuarioSesion.admin) ? $q.resolve() : $q.reject('reqAdmin');
        } else { return $q.reject('reqAdmin'); }
    };

    // Controlar los errores de cambio de rutas.
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
        if (rejection === 'reqAdmin') { $rootScope.goMain(); }
    })

    // Iniciar sesión con las cookies en el cliente.
    $rootScope.iniciar = function () {
        if (!$rootScope.usuarioSesion) {
            $http.get($rootScope.env.apiServer + "autenticarSesion")
                .then(function (response) {
                    $cookies.put('session', 1);
                    $rootScope.usuarioSesion = response.data;
                });
        } return;
    }

    // Cerrar la sesión de usuario abierta.
    $rootScope.salir = function () {
        $http.get($rootScope.env.apiServer + "cerrarSesion")
            .then(function (response) {
                if (response.status === 200) {
                    $cookies.remove('session');
                    $rootScope.usuarioSesion = null;
                    $rootScope.goMain();
                } else { $rootScope.showError(); }
            });
    }

    // Mostrar un error específico o genérico.
    $rootScope.showError = function (errorMessage) {
        errorDefault = "Se ha producido un error, intente de nuevo.";
        errorText = errorMessage ? errorMessage : errorDefault;
        $mdDialog.show($mdDialog.alert()
            .textContent(errorText).ok('Aceptar'));
    }

    // Mostrar un mensaje de confirmación específico o genérico.
    $rootScope.showConfirm = function (errorMessage) {
        errorDefault = "¿Está seguro que quiere realizar esta acción?";
        errorText = errorMessage ? errorMessage : errorDefault;
        return $mdDialog.show($mdDialog.confirm()
            .textContent(errorText).ok('Aceptar').cancel('Cancelar'));
    }

    // Ir a página principal y recargar.
    $rootScope.goMain = function () {
        window.location.href = "/";
    }

    // Ir a página de inicio de sesión.
    $rootScope.goLogin = function () {
        window.location.href = "/#!/ingresar";
    }

    // Volver a página anterior.
    $rootScope.goBack = function () {
        $window.history.back();
    }
});