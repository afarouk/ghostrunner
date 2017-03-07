/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/gameInterface.ejs',
	], function(Vent, template){
	var GameInterfaceView = Mn.View.extend({
		template: template,
		events: {
			'click .move': 'onMove',
			'click .stop': 'onStop'
		},
		onRender: function() {
			console.log('show interface');
		},
		onShowMask: function() {
			console.log('show mask');
			this.$('.mask').show();
		},
		onHideMask: function() {
			console.log('hide mask');
			this.$('.mask').hide();
		},

		onMove: function() {
			this.trigger('onPlayer:move');
		},

		onStop: function() {
			this.trigger('onGame:stop');
		}
	});
	return GameInterfaceView;
});