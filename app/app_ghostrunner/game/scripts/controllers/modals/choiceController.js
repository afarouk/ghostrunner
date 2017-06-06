/*global define */

'use strict';

define([
    '../../views/partials/confirmChoice'
    ], function(ConfirmChoiceView){
    var ChoiceController = Mn.Object.extend({
        showConfirmation: function(options) {
            var def = $.Deferred(),
                model = this.getConfirmModel(def, options);
                
            this.confirmView = new ConfirmChoiceView({
                model: model
            });
            this.onClose = this.publicController.getModalsController().show(this.confirmView);
            return def;
        },

        getConfirmModel: function(def, options) {
            var options = options || {};
            options.confirm = options.confirm || 'ok';
            options.reject = options.reject || false;
            options.cancel = options.cancel || false;
            options.choices = options.choices || false;
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

        showChoise: function(options) {
            var def = $.Deferred(),
                model = this.getChoiceModel(def, options);
            this.confirmView = new ConfirmChoiceView({
                model: model
            });
            this.onClose = this.publicController.getModalsController().show(this.confirmView);
            return def;
        },

        getChoiceModel: function(def, options) {
            var options = options || {};
            options.confirm = options.confirm || false;
            options.reject = options.reject || false;
            options.cancel = options.cancel || false;
            options.choices = options.choices || false;
            options.message = options.message || '?';
            options.callback = function (action) {
                this.onClose();
                this.confirmView.destroy();
                this.confirmView = null;
                def.resolve(action);
            }.bind(this);
            return new Backbone.Model(options);
        }

    });

    return new ChoiceController();
});
