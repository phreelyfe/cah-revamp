app.service("DB", function( $rootScope ){
    return {
        saveToStorage: function saveToStorage( property, value ) {
            var data;
            try {
                if (typeof value === 'object' && value.hasOwnProperty('$$hashKey')) delete value.$$hashKey;
                data = JSON.stringify( value );
            } catch (e) {
                data = value;
            } finally {
                localStorage[ property ] = data;
                return this.getFromStorage( property );
            }
        },
        getFromStorage: function getFromStorage( property ) {
            var data;
            var store = localStorage[ property ];
            try {
                data = JSON.parse( store );
                if (typeof store === 'object' && store.hasOwnProperty('$$hashKey')) delete store.$$hashKey;
            } catch (e) {
                data = localStorage[ property ];
            } finally {
                return data
            }
        }
    }
});