/**
 * Created by serg on 25.05.16.
 */
(function() {

    'use strict';

    angular.module('app.positions')
        .factory('positionAddObj', positionAddObj);

    // Main position add object
    function positionAddObj() {
        var positionAddObj;

        positionAddObj = {
            Title: '',
            MaterialParametrs: '',
            MaterialPlace: '',
            MaterialTerms: '',
            MaterialConditions: '',
            Unit: '',
            Currency: '',
            CategoryId: ''
        };

        return positionAddObj;
    }

})();
