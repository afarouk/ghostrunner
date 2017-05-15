/*global define */

'use strict';

define([
	'ejs!../../templates/partials/gameBtn.ejs'
	], function(template){
	var GameBtnView = Mn.View.extend({
		className: 'game-btn',
		template: template,
        modelEvents: {
            'change': 'render'
        },
        ui: {
            pause: '#pause_btn'
        },
		events: {
            'click #abandon_btn' :'onClickAbandonBtn',
            'click @ui.pause' :'onClickPauseBtn'
		},
        onShowGameBtns: function(){
            this.$el.addClass('visible');
        },
        onHideGameBtns: function(){
            this.$el.removeClass('visible');
        },
        onClickPauseBtn: function() {
            this.publicController.getGameBtnController().clickPauseBtn();
        },
        onClickAbandonBtn: function(e){
          this.publicController.getGameBtnController().clickAbandonBtn();
        }
	});
	return GameBtnView;
});