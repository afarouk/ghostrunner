/*global define */

'use strict';

define([
	'ejs!../../templates/partials/gameBtn.ejs'
	], function(template){
	var GameBtnView = Mn.View.extend({
		className: 'game-btn',
		template: template,		
		events: {
            'click #abandon_btn' :'onClickAbandonBtn'
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