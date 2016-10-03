'use strict';

/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
var states = [
        { name: 'base', state: { abstract: true, url: '', templateUrl: 'views/base.html', data: {text: "Base", visible: false } } },
        { name: 'dashboard', state: { url: '/dashboard', parent: 'base', templateUrl: 'views/dashboard.html', controller: 'DashboardCtrl', data: {text: "Dashboard", visible: false } } },
        { name: 'adGroupKeywordsTool', state: { url: '/adGroupKeywordsTool', parent: 'dashboard', templateUrl: 'pages/adgroup_keywords_tool/adgroup_keywords_tool.html', controller: 'AdgroupKeywordsToolCtrl', data: {text: "Ad Group Keywords Tool", visible: true } } },
        // { name: 'login', state: { url: '/login', parent: 'base', templateUrl: 'views/login.html', controller: 'LoginCtrl', data: {text: "Login", visible: false } } },
        // { name: 'overview', state: { url: '/overview', parent: 'dashboard', templateUrl: 'views/dashboard/overview.html', data: {text: "Overview", visible: true } } },
        // { name: 'reports', state: { url: '/reports', parent: 'dashboard', templateUrl: 'views/dashboard/reports.html', controller: 'LoginCtrl', data: {text: "Reports", visible: true } } },
        // { name: 'logout', state: { url: '/login', data: {text: "Logout", visible: true }} }
    ];
   
angular.module('yapp', [
                'ui.router',
                'snap',
                'ngAnimate'
            ])
        .config(function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.when('/dashboard', '/dashboard/adGroupKeywordsTool');
            $urlRouterProvider.otherwise('/dashboard', '/dashboard/adGroupKeywordsTool');
            
            angular.forEach(states, function (state) {
                $stateProvider.state(state.name, state.state);
            });
        });
