/**
 * Created by serg on 25.05.16.
 */
(function () {

    'use strict';

    angular.module('app.positions')
        .controller('PositionsCtrl', ['rest', 'MainSettings', PositionsCtrl])
        .controller('PositionsAdd', ['rest', 'positionAddObj', PositionsAdd])
        .controller('PositionsEdit', ['rest', 'positionAddObj', '$stateParams', PositionsEdit]);

    // Main positions controller
    function PositionsCtrl(rest, MainSettings) {

        var self = this;

        self.getPositions = getPositions;

        self.categories = rest.get({customUrl: 'Tender/GetCategories'});

        /**
         * @type {{customUrl: string, Page: number, PerPage: number}}
         * Main tenders config obj
         */
        self.positionCnfg = {
            customUrl: 'Position/GetPositions',
            categoryId: null,
            Page: 1,
            PerPage: 5
        };

        /**
         * Get positions list
         */
        function getPositions() {

            console.log('Высылаю ', self.positionCnfg);

            self.list = rest.save(MainSettings.serverDirect() + '/api/' + self.positionCnfg.customUrl + self.positionCnfg.categoryId, self.positionCnfg);


            self.list.$promise.then(function (response) {
                self.positionCnfg.totalCount = response.TotalItemsCount;
                console.log(self.positionCnfg.customUrl, ': ', response);
            });

        }

        getPositions();
    }


    // Position add
    function PositionsAdd(rest, positionAddObj) {

        var self = this;

        // Position functions
        self.savePosition = savePosition;

        self.positionAddObj = positionAddObj;

        for (var field in self.positionAddObj) {
            if (self.positionAddObj.hasOwnProperty(field)) {
                self.positionAddObj[field] = '';
            }
        }

        // Gei position init data
        self.posUnits = rest.query({customUrl: 'Position/GetUnits'});
        self.posCurrencys = rest.query({customUrl: 'Position/GetCurrencys'});
        self.posFactories = rest.query({customUrl: 'Position/GetFactories'});
        self.posCategory = rest.get({customUrl: 'Tender/GetCategories'});


        function savePosition() {
            var autoText = 'По договоренности, на основании согласованных заявок';

            if (self.positionAddObj.MaterialTerms == '' || self.positionAddObj.MaterialTerms == null) {
                self.positionAddObj.MaterialTerms = autoText;
            }

            if (self.positionAddObj.MaterialConditions == '' || self.positionAddObj.MaterialConditions == null) {
                self.positionAddObj.MaterialConditions = autoText;
            }

            rest.save({customUrl: 'Position/SavePositions'}, self.positionAddObj);

            console.log('Сохраняю позицию: ', self.positionAddObj);
        }
    }

    // Position edit
    function PositionsEdit(rest, positionAddObj, $stateParams) {

        var self = this;

        // Position functions
        self.savePosition = savePosition;

        self.positionAddObj = positionAddObj;


        // Gei position init data
        self.posUnits = rest.query({customUrl: 'Position/GetUnits'});
        self.posCurrencys = rest.query({customUrl: 'Position/GetCurrencys'});
        self.posFactories = rest.query({customUrl: 'Position/GetFactories'});
        self.posCategory = rest.get({customUrl: 'Tender/GetCategories'});

        // Init position model && bind with view models
        self.position = rest.get({customUrl: 'Position/GetPosition', positionId: $stateParams.positionId});
        self.position.$promise.then(function (response) {

            self.positionAddObj.CategoryId = response.category.id;
            self.positionAddObj.Title = response.title;
            self.positionAddObj.MaterialPlace = response.materialPlace.id;
            self.positionAddObj.MaterialTerms = response.materialTerms;
            self.positionAddObj.MaterialParametrs = response.materialParametrs;
            self.positionAddObj.MaterialConditions = response.materialConditions;
            self.positionAddObj.Currency = response.currency.id;
            self.positionAddObj.Unit = response.unit.id;
            self.positionAddObj.Id = response.id;

            console.log('Position/GetPosition ', response);

        });

        // Save position
        function savePosition() {
            var autoText = 'По договоренности, на основании согласованных заявок';

            if (self.positionAddObj.MaterialTerms == '' || self.positionAddObj.MaterialTerms == null) {
                self.positionAddObj.MaterialTerms = autoText;
            }

            if (self.positionAddObj.MaterialConditions == '' || self.positionAddObj.MaterialConditions == null) {
                self.positionAddObj.MaterialConditions = autoText;
            }

            rest.save({customUrl: 'Position/SavePositions'}, self.positionAddObj);

            console.log('Сохраняю позицию: ', self.positionAddObj);
        }

    }

})();
