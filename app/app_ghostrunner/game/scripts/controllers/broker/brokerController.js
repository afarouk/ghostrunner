/*global define */

'use strict';

define([
    '../../Vent',
    '../../views/mainBroker'
    ], function(Vent, MainBrokerView){
    var BrokerController = Mn.Object.extend({
        create: function(layout, region) {
            this.view = new MainBrokerView();
            layout.showChildView( region, this.view );
        }
    });

    return new BrokerController();
});
