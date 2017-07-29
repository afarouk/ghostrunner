/*global define */

'use strict';

define([
	'ejs!../../templates/partials/PintchlineUpCreation.ejs',
	'./pintchlineUpPlayersList'
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
                flag:true
			});

            this.availableplayers = new LineUpPlayersList({
				collection: this.options.availableplayers,
				lineUp: this.lineUp,
				headings:this.options.headings,
                flag:false
			});
			this.showChildView('players', this.lineUpPlayersList);
            this.showChildView('availableplayers', this.availableplayers);
			//this.listenTo(this.lineUpPlayersList, 'lineUp:changed', //this.onLineUpChanged.bind(this));
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
				leagueId = model.get('leagueId');

			if (!checked) {
				var forRemove = this.lineUp.findWhere({playerId: playerId, seasonId: seasonId, leagueId:leagueId });
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
            var obj = {};
            var oldLeagueId='',oldSeasonId='',oldPlayerId='', newSeasonId='', newPosition='', newPlayerId='';

             $('.CurrentPlayers').each(function () {
                if (!this.checked) {
                        oldLeagueId= $(this).attr('oldLeagueId');
												oldSeasonId= $(this).attr('oldSeasonId');
                        oldPlayerId = $(this).attr('oldPlayerId');
                }
            });


            $('.AvailablePlayers').each(function(){
                if(this.checked){
									newLeagueId =  $(this).attr('newLeagueId');
                  newSeasonId =  $(this).attr('newSeasonId');
                  newPlayerId =  $(this).attr('newPlayerId');
                  newPosition =  $(this).attr('newPosition');
                }
            });

            obj = {
				  			oldLeagueId : oldLeagueId,
                oldSeasonId : oldSeasonId,
                oldPlayerId : oldPlayerId,
								newLeagueId : newLeagueId,
                newSeasonId : newSeasonId,
                newPlayerId : newPlayerId,
                newPosition : newPosition
            }
             this.trigger('lineUp:save',obj);
	 }
        });
	  return LineUpCreationView;
    });
