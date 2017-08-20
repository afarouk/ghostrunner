/*global define */

'use strict';

define([
	'ejs!../../templates/partials/pinchLineUpCreation.ejs',
	'ejs!../../templates/partials/pinchLineUpFielder.ejs',
	'ejs!../../templates/partials/pinchLineUpTable.ejs'
	], function(template, LineUpPlayersList){
	var LineUpCreationView = Mn.View.extend({
		template: template,
		tagName: 'section',
		className: 'create-lineUp',
		regions: {
			players: '.players-list-container',
            availableplayers: '.players-list-Availableplayers'
		},
		ui: {
			name: '[name="lineUp-name"]',
			count: '[name="count"]',
			save: '[name="save"]'
		},
		events: {
			'change @ui.name': 'onNameChanged',
			'keyup @ui.name': 'onNameChanged',
			'click @ui.save': 'onSave'
		},
		lineUpName: '',
		initialize: function(options) {
			this.lineUp = options.lineUp;
			this.lineUp.on('change add remove', this.checkIfSaveAllowed, this);
		},
		serializeData: function() {
			this.lineUpName = this.options.lineUpName;
			return {
				teamName: this.options.teamName,
				lineUpName: this.options.lineUpName
			};
		},
		onRender: function() {
			this.lineUpPlayersList = new LineUpPlayersList({
				collection: this.options.players,
				lineUp: this.lineUp,
				headings: this.options.headings,
                flag: true
			});

            this.availableplayers = new LineUpPlayersList({
				collection: this.options.availableplayers,
				lineUp: this.lineUp,
				headings: this.options.headings,
                flag: false
			});
			this.showChildView('players', this.lineUpPlayersList);
            this.showChildView('availableplayers', this.availableplayers);
		},
		onNameChanged: function() {
			var name = this.ui.name.val();
			if (name.length > 1) { //TODO validation
				this.lineUpName = name;
			} else {
				this.lineUpName = '';
			}
			this.checkIfSaveAllowed();
		},
		onLineUpChanged: function(checked, model) {
			var playerId = model.get('playerId'),
				seasonId = model.get('seasonId'),
				leagueId = model.get('leagueId'),
				playerRoleId=model.get('playerRoleId');

			if (!checked) {
				var forRemove = this.lineUp.findWhere({playerId: playerId, seasonId: seasonId, leagueId:leagueId ,playerRoleId:playerRoleId});
				this.lineUp.remove(forRemove);
			} else {
				this.lineUp.add(model);
			}
			this.ui.count.text(this.lineUp.length);
		},
		showCountWarning: function() {
			this.publicController.getChoiceController().showConfirmation({
                message: 'Count should be less than 10.',
                confirm: 'ok'
            });
		},
		checkCount: function() {
			var count  = this.lineUp.length;
			this.ui.count.text(count);
			if (count > 9) {
				this.ui.count.css('color', 'red');
				this.lineUpPlayersList.triggerMethod('players:selection:allow', false);
				this.showCountWarning();
				return false;
			} else {
				this.ui.count.css('color', '#71ff61');
				this.lineUpPlayersList.triggerMethod('players:selection:allow', true);
				return true;
			}
		},
		checkIfSaveAllowed: function() {
			console.log(this.lineUp.toJSON());
			if (this.lineUp.length > 0 && this.lineUpName) {
				this.ui.save.attr('disabled', false);
				return true;
			} else {
				this.ui.save.attr('disabled', true);
				return false;
            }
		},
		onSave: function() {
            var playersParams,
            	oldPlayerRoleId = '',
            	oldLeagueId = '',
            	oldSeasonId = '',
            	oldPlayerId = '',
            	newPlayerRoleId = '',
            	newLeagueId = '',
            	newSeasonId = '',
            	newPosition = '',
            	newPlayerId = '';

            $('.CurrentPlayers').each(function () {
                if (!this.checked) {
      				oldPlayerRoleId= $(this).attr('oldPlayerRoleId');
                    oldLeagueId= $(this).attr('oldLeagueId');
					oldSeasonId= $(this).attr('oldSeasonId');
                    oldPlayerId = $(this).attr('oldPlayerId');
                }
            });


            $('.AvailablePlayers').each(function(){
                if(this.checked){
					newPlayerRoleId =  $(this).attr('newPlayerRoleId');
					newLeagueId =  $(this).attr('newLeagueId');
                	newSeasonId =  $(this).attr('newSeasonId');
                	newPlayerId =  $(this).attr('newPlayerId');
                	newPosition =  $(this).attr('newPosition');
                }
            });

            playersParams = {
				oldPlayerRoleId : oldPlayerRoleId,
				oldLeagueId : oldLeagueId,
                oldSeasonId : oldSeasonId,
                oldPlayerId : oldPlayerId,
				newPlayerRoleId : newPlayerRoleId,
				newLeagueId : newLeagueId,
                newSeasonId : newSeasonId,
                newPlayerId : newPlayerId,
                newPosition : newPosition
            }
            this.trigger('lineUp:save', playersParams);
    	}
    });

	return LineUpCreationView;
});
