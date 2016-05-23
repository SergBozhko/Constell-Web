/**
 * Created by admin on 11.05.16.
 */
(function() {

    'use strict';

    angular.module('app.tenders')
        .factory('formSteps', formSteps)
        .factory('addTenderModel', addTenderModel);

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

    // Add tender Model
    function addTenderModel() {
        var addTenderModel;

        addTenderModel = {
            CategoryId: null,
            Title: '',
            StartDate: null,
            EndDate: null,
            IsOpenTender: false,
            IsActive: true,
            ForCertificed: false,
            PositionList: []
        };

        return addTenderModel;
    }

})();
