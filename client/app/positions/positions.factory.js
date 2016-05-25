/**
 * Created by serg on 25.05.16.
 */
(function() {

    'use strict';

    angular.module('app.positions')
        .factory('positionAddObj', positionAddObj);

    function positionAddObj() {
        var positionAddObj;

        positionAddObj = {
            Title: '',
            Contacts: '',
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
