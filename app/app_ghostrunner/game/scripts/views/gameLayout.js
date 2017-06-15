/*global define */

'use strict';

define([
	'ejs!../templates/gameLayout.ejs'
	], function(template){
	var GameLayoutView = Mn.View.extend({
		template: template,
		className: 'game-container',
		regions: {
			field: '#game-field',
			interface: '#game-interface'
		},
		onRender: function() {
			this.renderGame();
		},
		renderGame: function() {
			this.publicController.getFieldController().create(this, 'field');
			this.publicController.getInterfaceController().create(this, 'interface');
			if (this.options.showTossAnimation) {
                this.showTossAnimation();
            }
		},
		showTossAnimation: function() {
			console.log('show toss animation');
			this.$el.addClass('fadeIn');
			this.$('.toss').addClass('begin');
        }
	});
	return GameLayoutView;
});