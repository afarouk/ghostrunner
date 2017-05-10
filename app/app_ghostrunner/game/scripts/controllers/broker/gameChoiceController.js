/*global define */

'use strict';

define([
    '../../Vent',
    '../../appCache',
    '../../views/partials/gameChoice',
    '../../views/partials/gameSelectChoice',
    ], function(Vent,appCache, GameChoiceView,GameSelectChoice){
    var GameChoiceController = Mn.Object.extend({
            create: function(layout, region) {
                this.view = new GameChoiceView();
                layout.showChildView( region, this.view );
            },
        
            showSelect: function(options) {
                var def = $.Deferred(),
                    model = this.getSelectModel(def, options);

                this.onShow();
                this.gameSelectView = new GameSelectChoice({
                    model: model
                });
                this.view.showChildView('select', this.gameSelectView);
                return def;
            },

            getSelectModel: function(def, options) {
                options = options || {};
                options.message = options.message || '...';
                options.confirm = options.confirm || 'ok';
                options.list = options.list || [];
                options.callback = function(gameUUID) {
                    this.gameSelectView.destroy();
                    this.gameSelectView = null;
                    this.onClose();
                    def.resolve(gameUUID);
                }.bind(this);
                var model = new Backbone.Model(options);
                return model;
            },

            onShow: function() {
               this.view.$el.parent().show();
            },

            onClose: function() {
               this.view.$el.parent().hide();
            },
            
            setGameUUID: function(gameUUID){
                appCache.set('urlGameUUID',gameUUID); //for temporary save gameUUID that passed through url params
            },
        
            getUrlGameUUID: function() {
                return appCache.get('urlGameUUID');
            },
        
            removeUrlGameUUID: function() {
                appCache.remove('urlGameUUID');
            }
        });

    return new GameChoiceController();
});
