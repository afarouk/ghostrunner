/*global define */

'use strict';

define([
	'ejs!../templates/informationTable.ejs',
	], function(template){
	var InformationTableView = Mn.View.extend({
		template: template,
		className: 'information-table-container',
		modelEvents: {
	        'change': 'render'
	    },
	    ui: {
            pause: '#pause_btn',
            abandon: '#abandon_btn',
            opponentStatus: '.opponent-in-game',
            homePBtn: '.team-panel-button.home',
            awayPBtn: '.team-panel-button.away',
        },
		events: {
            'click @ui.abandon' :'onClickAbandonBtn',
            'click @ui.pause' :'onClickPauseBtn',
            'click @ui.homePBtn': 'showHomePanel',
            'click @ui.awayPBtn': 'showAwayPanel'
		},
		onRender: function() {

		},
		onClickPauseBtn: function() {
            this.publicController.getInformationTableController().clickPauseBtn();
        },
        onClickAbandonBtn: function(e){
          this.publicController.getInformationTableController().clickAbandonBtn();
        },
        showHomePanel: function() {
        	this.$el.toggleClass('home-panel-show');
        	this.$el.removeClass('away-panel-show');
        },
        showAwayPanel: function() {
        	this.$el.toggleClass('away-panel-show');
        	this.$el.removeClass('home-panel-show');
        },
	});
	return InformationTableView;
});