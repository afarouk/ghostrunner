/*global define */

'use strict';

define([
    '../Vent',
    '../views/chat'
    ], function(Vent, ChatView){
    var ChatController = Mn.Object.extend({
		create: function(layout, region) {
			this.view = new ChatView();
			layout.showChildView( region, this.view );
		}
    });

    return new ChatController();
});
