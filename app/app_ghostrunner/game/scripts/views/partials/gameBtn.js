/*global define */

'use strict';

define([
	'ejs!../../templates/partials/gameBtn.ejs'
	], function(template){
	var GameBtnView = Mn.View.extend({
		className: 'game-btn',
		template: template,		
		events: {
			'click .expand-btn': 'onExpandBtn',
            'click #abandon_btn' :'onClickAbandonBtn'
		},
		onExpandBtn: function() {
		$('#game-layout').toggleClass('full_screen_game');
		$('.fa-expand').toggleClass('fa-compress');            
		},
        onShowAbandonBtn: function(){
        $('#abandon_btn').show();
        },
        onHideAbandonBtn: function(){
        $('#abandon_btn').hide();
        },
        onClickAbandonBtn: function(e){
          this.publicController.getGameBtnController().clickAbandonBtn();
        }
	});
	return GameBtnView;
});