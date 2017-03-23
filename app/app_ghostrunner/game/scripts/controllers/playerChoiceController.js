/*global define */

'use strict';

define([
    '../Vent',
    '../views/partials/playerChoice',
    '../views/partials/confirmChoice',
    '../views/partials/selectChoice'
    ], function(Vent, PlayerChoiceView, ConfirmChoiceView, SelectChoiceView){
    var PlayerChoiceController = Mn.Object.extend({
            create: function(layout, region) {
                this.view = new PlayerChoiceView();
                layout.showChildView( region, this.view );
            },
            showConfirmatio: function(options) {
                var def = $.Deferred(),
                    model = this.getConfirmModel(def, options);
                    
                this.confirmView = new ConfirmChoiceView({
                    model: model
                });
                this.view.showChildView('confirm', this.confirmView);
                this.onShow();
                return def;
            },

            getConfirmModel: function(def, options) {
                var options = options || {};
                options.confirm = options.confirm || 'ok';
                options.meesage = options.message || '?';
                options.callback = function (action) {
                    this.onClose();
                    if (action === 'confirm') {
                        def.resolve();
                    } else {
                        def.reject();
                    }
                    this.confirmView.destroy();
                }.bind(this);
                return new Backbone.Model(options);
            },

            showSelect: function(options) {
                var def = $.Deferred(),
                    model = this.getSelectModel(def, options);
                this.view.showChildView('select', new SelectChoiceView({
                    model: model
                }));
                this.onShow();
                return def;
            },

            getSelectModel: function(def, options) {
                options = options || {};
                options.message = options.message || '...';
                options.confirm = options.confirm || 'ok';
                options.list = options.list || [];
                options.callback = function(uid) {
                    this.onClose();
                    def.resolve(uid);
                }.bind(this);
                var model = new Backbone.Model(options);
                return model;
            },

            onShow: function() {
                this.view.$el.parent().show();
            },

            onClose: function() {
                this.view.$el.parent().hide();
            }
        });

    return new PlayerChoiceController();
});
