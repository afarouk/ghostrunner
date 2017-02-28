/*global define*/
    
'use strict';

define([], function(){
    var cache = {},
        _getItem = function(key) {
            if ( typeof key !== 'string' ) {
                throw new Error('First parameter must be string');
            }
            return cache[key];
        },
        AppCache = Mn.Object.extend({
            set: function(key, value) {
                cache[key] = value;
                this.trigger('change:' + key, value);
            },

            get: function(key, callback) {
                var item = _getItem(key);
                if ( !item && callback ) {
                    callback();
                    return;
                }
                return item;
            },

            remove: function(key) {
                return delete cache[key];
            },

            fetch: function(key, value) {
                var item = _getItem(key);
                if ( !item ) {
                    this.set( key, value );
                }
                return this.get(key);
            },

            clear: function(){
                var key;
                for( key in cache ){
                    cache[key] = null;
                }
            }
        });

    return new AppCache();
});