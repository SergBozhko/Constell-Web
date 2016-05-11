/**
 * Created by admin on 11.05.16.
 */
(function() {

    'use strict';

    angular.module('app.tenders')
        .factory('formSteps', formSteps);

    // Form steps
    function formSteps() {

        var formStepsObj;

        formStepsObj = {
            steps: {
                first: {
                    active: true,
                    enable: true
                },
                second: {
                    active: false,
                    enable: false
                }
            },
            finish: false
        };

        return formStepsObj;
    }

})();
