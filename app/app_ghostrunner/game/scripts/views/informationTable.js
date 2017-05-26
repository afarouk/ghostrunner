/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/informationTable.ejs',
	], function(Vent, template){
	var InformationTableView = Mn.View.extend({
		template: template,
		className: 'information-table-container',
		modelEvents: {
	        'change': 'render'
	    },
	    ui: {
            pause: '#pause_btn',
            abandon: '#abandon_btn',
            opponentStatus: '.opponent-in-game'
        },
		events: {
            'click @ui.abandon' :'onClickAbandonBtn',
            'click @ui.pause' :'onClickPauseBtn'
		},
		onRender: function() {
			console.log('InformationTableView');
		},
		onClickPauseBtn: function() {
            this.publicController.getInformationTableController().clickPauseBtn();
        },
        onClickAbandonBtn: function(e){
          this.publicController.getInformationTableController().clickAbandonBtn();
        }
	});
	return InformationTableView;
});