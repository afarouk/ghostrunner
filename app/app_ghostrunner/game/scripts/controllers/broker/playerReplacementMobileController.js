/*global define */

'use strict';

define([
    '../../appCache',
    '../../APIGateway/gameService',
    '../../views/partials/lineUpReplacementMobile',
    '../../models/playersCollection'
    ], function(appCache, service, LineUpReplacement, PlayersCollection){
    var PlayerReplacementController = Mn.Object.extend({

        managePlayerReplacement: function(view, action) {
            switch (action) {
                case 'PINCH_HIT':
                    this.retrivePinchHitter(view, this.onSetPinchHitter,
                        'Select replacement for batter (pinch hitter)');
                    break;
                case 'PINCH_RUN':
                    this.retrivePinchRunner(view, this.onSetPinchRunner,
                        'Select replacement for runner (pinch runner)');
                    break;
                case 'DEFENSIVE_SUBSTITUTION':
                    this.retrieveDefensiveSubstitutionChoices(view, this.onSetDefensiveSubstitution,
                        'Select replacement for fielder');
                    break;
                case 'RELIEF_PITCHER':
                    this.retrieveReliefPitcherChoices(view, this.onSetReliefPitcher,
                        'Select relief pitcher');
                    break;
                default:
                    this.retrivePinchHitter(view, this.onSetPinchHitter,
                        'Select replacement for batter (pinch hitter)');
                    break
            }
        },

        //retrieve
        retrivePinchHitter:function(layout, onSaveMethod, title){
            service.retrievePinchHitterChoices()
                .then(function(players){
                    this.onShapeLineUp(players, onSaveMethod, title);
                }.bind(this), function(xhr){
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
            this.layout = layout;
        },

        retrivePinchRunner:function(layout, onSaveMethod, title){
            service.retrievePinchRunnerChoices()
                .then(function(players){
                    this.onShapeLineUp(players, onSaveMethod, title);
                }.bind(this), function(xhr){
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
            this.layout = layout;
        },

        retrieveDefensiveSubstitutionChoices:function(layout, onSaveMethod, title){
            service.retrieveDefensiveSubstitutionChoices()
                .then(function(players){
                    this.onShapeLineUp(players, onSaveMethod, title);
                }.bind(this), function(xhr){
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
            this.layout = layout;
        },

        retrieveReliefPitcherChoices:function(layout, onSaveMethod, title){
            service.retrieveReliefPitcherChoices()
                .then(function(players){
                    this.onShapeLineUp(players, onSaveMethod, title);
                }.bind(this), function(xhr){
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
            this.layout = layout;
        },

        //show
        onShapeLineUp: function(players, onSaveMethod, title) {
            var current = players.currentLineup || players.currentPitcher;
            this.players = players;
            var replaceData = {
                    players: (new PlayersCollection()).getLineUps(current),
                    availablePlayers: (new PlayersCollection()).getAvailablePlayers(players.availablePlayers),
                    headings: players.lineUpHeadings,
                    title: title
                },
                lineUpReplacement = new LineUpReplacement(replaceData);
            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', lineUpReplacement);
            this.listenTo(lineUpReplacement, 'lineUp:save', onSaveMethod.bind(this));
        },

        //set
        onSetPinchHitter: function(playersParams){
            service.setPinchHitter(playersParams).then(function(result){
                this.onAfterSet(result)
            }.bind(this), function(xhr){
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
        },

        onSetPinchRunner: function(playersParams){
            service.setPinchRunner(playersParams).then(function(result){
                this.onAfterSet(result)
            }.bind(this), function(xhr){
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
        },

        onSetDefensiveSubstitution: function(playersParams){
            service.setDefensiveSubstitution(playersParams).then(function(result){
                this.onAfterSet(result)
            }.bind(this), function(xhr){
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
        },

        onSetReliefPitcher: function(playersParams){
            service.setReliefPitcher(playersParams).then(function(result){
                this.onAfterSet(result)
            }.bind(this), function(xhr){
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
        },

        onAfterSet: function(result) {
            var game = appCache.get('game');
            this.publicController.getModalsController().afterSaveRequest().then(function(){
                this.backInGame( game.get('gameUUID') , result.state);
            }.bind(this), function(xhr){
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
        },
        //..............

        backInGame: function( gameUUID , state) {
            this.publicController.getStateController().refreshStatus(gameUUID);
            this.publicController.getGameController().switchToGame();
        }
    });

    return new PlayerReplacementController();
});
