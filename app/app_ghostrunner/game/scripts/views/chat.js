/*global define */

'use strict';

define([
	'ejs!../templates/chat.ejs',
	], function(template){
	var ChatView = Mn.View.extend({
		template: template,
		ui: {
			chatBtn: '[name="chat-btn"]'
		},
		events: {
			'click @ui.chatBtn': 'clickChatBtn'
		},
		onRender: function() {

		},
		clickChatBtn: function() {
			var $target = $('#chat-content .draggable');
			$target.show('slow');
			this.ui.chatBtn.hide();
			$target.draggable({
				containment: $('#game-layout')
			}).find('.close').on('click', function() {
				$target.hide('slow').draggable( 'destroy' );
				this.ui.chatBtn.show();
			}.bind(this));
		}
	});
	return ChatView;
});