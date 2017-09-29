/*global define */

'use strict';

define([
    '../views/chat'
    ], function(ChatView){
    var ChatController = Mn.Object.extend({
		create: function(layout, region) {
			this.view = new ChatView();
			layout.showChildView( region, this.view );
		}, 
		resetPosition: function() {
			this.view.triggerMethod('resetPosition');
		}
    });

    return new ChatController();
});
