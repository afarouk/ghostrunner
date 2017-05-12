/*global define */

'use strict';

define([
    '../../Vent',
    '../../views/modalsLayout'
    ], function(Vent, ModalsLayoutView){
    //We need it for show modal dialogs
    var ModalsController = Mn.Object.extend({
		create: function(layout, region) {
            this.view = new ModalsLayoutView();
            layout.showChildView( region, this.view );
        },

        show: function(view) {
            $('#modals').show();
            this.view.showChildView('container', view);
            this.view.getRegion('container').$el.show();
            return this.hide.bind(this);
        },

        hide: function() {
            $('#modals').hide();
            this.view.getRegion('container').$el.hide();
        }
    });

    return new ModalsController();
});
