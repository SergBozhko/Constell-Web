/**
 * Created by serg on 29.06.16.
 */
(function() {

    'use strict';

    angular.module('app.users')
        .factory('UserModel', UserModel)
        .factory('UserConf', UserConf);

    // Main User Model
    function UserModel() {

        //category
        //    :
        //    "Гофротара"
        //categoryId
        //    :
        //    3
        //city
        //    :
        //    "5656"
        //company
        //    :
        //    "LLC "Lynx Solution""
        //countOffers
        //    :
        //    39
        //email
        //    :
        //    "gromanev@gmail.com"
        //id
        //    :
        //    1
        //isCertified
        //    :
        //    false
        //name
        //    :
        //    "Глебов Роман"
        //otherContacts
        //    :
        //                    "
        //passwordHash
        //    :
        //    null
        //phone
        //    :
        //    "8(918) 47 57 691"
        //role
        //    :
        //    "Не заключён договор"
        //roleId
        //    :
        //    "user"

        class User {
            constructor(id, company, name, phone, email, categoryId) {
                this.id = id;
                this.company = company;
                this.name = name;
                this.phone = phone;
                this.email = email;
                this.categoryId = categoryId;
            }
        }

        return User;

    }

    // User config
    function UserConf() {

        class UserConf {
            constructor(customUrl, Page, PerPage, SearchName) {
                this.customUrl = customUrl;
                this.Page = Page;
                this.PerPage = PerPage;
                this.SearchName = SearchName;
            }
        }

        return UserConf;

    }

})();
