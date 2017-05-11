/*global define */

'use strict';

define([
    '../../Vent',
    '../../views/partials/playerChoice',
    '../../views/partials/confirmChoice',
    '../../views/partials/selectChoice'
    ], function(Vent, PlayerChoiceView, ConfirmChoiceView, SelectChoiceView){
    var ChoiceController = Mn.Object.extend({
        create: function(layout, region) {
            this.view = new PlayerChoiceView();
            layout.showChildView( region, this.view );
        },
        showConfirmation: function(options) {
            var def = $.Deferred(),
                model = this.getConfirmModel(def, options);
                
            this.onShow();
            this.confirmView = new ConfirmChoiceView({
                model: model
            });
            this.view.showChildView('confirm', this.confirmView);
            return def;
        },

        getConfirmModel: function(def, options) {
            var options = options || {};
            options.confirm = options.confirm || 'ok';
            options.reject = options.reject || false;
            options.cancel = options.cancel || false;
            options.message = options.message || '?';
            options.callback = function (action) {
                this.onClose();
                this.confirmView.destroy();
                this.confirmView = null;
                if (action === 'confirm') {
                    def.resolve();
                } else if (action === 'reject') {
                    def.reject('reject');
                } else {
                    def.reject('cancel');
                }
            }.bind(this);
            return new Backbone.Model(options);
        },

        showSelect: function(options) {
            var def = $.Deferred(),
                model = this.getSelectModel(def, options);

            this.onShow();
            this.selectView = new SelectChoiceView({
                model: model
            });

            this.view.showChildView('select', this.selectView);
            return def;
        },

        getSelectModel: function(def, options) {
            options = options || {};
            options.message = options.message || '...';
            options.confirm = options.confirm || 'ok';
            options.list = options.list || [];
            options.callback = function(uid) {
                this.selectView.destroy();
                this.selectView = null;
                this.onClose();
                def.resolve(uid);
            }.bind(this);
            var model = new Backbone.Model(options);
            return model;
        },

        onShow: function() {
            if (this.selectView) {
                this.selectView.destroy();
            }
            if (this.confirmView) {
                this.confirmView.destroy();
            }
            this.view.$el.parent().show();
        },

        onClose: function() {
            this.view.$el.parent().hide();
        }
    });

    return new ChoiceController();
});
