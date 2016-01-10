var parse = require('parse-api').Parse;
// Parse API Keys
var APP_ID = "crvtKIS2lxtvpwrSxRGGLeiVEL8rxth2AeuLRkET";
var MASTER_KEY = "EU4wPxwewXpLi8zgI18mJEz3A9xOx58CMWiuRVBu";
// Enable Parse
var Parse = new parse(APP_ID, MASTER_KEY);

module.exports = function() {
    return {
        setActive: function(id) {
            // Set Game Active Ref In Parse
        },
        find: function(Class, obj, cb) {
            return new Promise(function(resolve, reject) {
                Parse.find(Class, obj, cb || function(err, data) {
                    // If Error Set Games to Empty Object
                    if (err) return reject(err);
                    resolve(data);
                });
            })
        },
        update: function(Class, id, data, cb) {
        	if (data.hasOwnProperty('$$hashKey')) delete data.$$hashKey;
            return new Promise(function(resolve, reject) {
                Parse.update(Class, id, data, cb || function(err, data) {
                    // If Error Set Games to Empty Object
                    if (err) return reject(err);
                    return resolve(data);
                });
            })
        },
        insert: function(Class, data , cb) {
        	return new Promise(function(resolve, reject) {
        		Parse.insert(Class, data, cb || function(err, data) {
                    // If Error Set Games to Empty Object
                    if (err) return reject(err);
                    return resolve(data);
                });
        	});
        }
    }
}