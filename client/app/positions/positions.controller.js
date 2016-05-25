/**
 * Created by serg on 25.05.16.
 */
(function() {

    'use strict';

    angular.module('app.positions')
        .controller('PositionsAdd', ['rest', 'positionAddObj',  PositionsAdd]);


    function PositionsAdd(rest, positionAddObj) {

        var self = this;

        // Position functions
        self.savePosition = savePosition;

        self.positionAddObj = positionAddObj;

        // Gei position init data
        self.posUnits = rest.query({customUrl: 'Position/GetUnits'});
        self.posCurrencys = rest.query({customUrl: 'Position/GetCurrencys'});
        self.posFactories = rest.query({customUrl: 'Position/GetFactories'});
        self.posCategory = rest.get({customUrl: 'Tender/GetCategories'});


        function savePosition() {
            rest.save({customUrl: 'Position/SavePositions'}, self.positionAddObj);

            console.log('Сохраняю позицию: ', self.positionAddObj);
        }
    }

})();
