/*global define */

'use strict';

define([
	'ejs!../../templates/partials/gameBtn.ejs'
	], function(template){
	var GameBtnView = Mn.View.extend({
		className: 'game-btn',
		template: template,
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
        onUpdateState: function(state) {
            if (state == "PAUSED") {
                this.ui.pause.text('Unpause');
            } else {
                this.ui.pause.text('Pause');
            }
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