/*global define */

'use strict';

define([
    '../../Vent',
    '../../views/mainBroker',
    '../../views/partials/playersList',
    '../../APIGateway/gameService'
    ], function(Vent, MainBrokerView, PlayersList, service){
    var BrokerController = Mn.Object.extend({
        create: function(layout, region) {
            this.view = new MainBrokerView();
            layout.showChildView( region, this.view );
            this.listenTo(this.view, 'getPlayers', this.onGetPlayers.bind(this));
        },
        onGetPlayers: function() {
            if (!this.selectedPlayer) {
                this.publicController.getInterfaceController().showLoader();
                this.view.ui.invite.text('Invite').attr('disabled', true);
                service.getAvailableUsers()
                    .then(function(response){
                        this.publicController.getInterfaceController().hideLoader();
                        if (response.count > 0) {
                            this.showPlayersList(response);
                        }
                    }.bind(this), function(err){
                        
                    }.bind(this));
            } else {
                var inviteeUID = this.selectedPlayer.get('uid');
                this.publicController.getStateController().onSendInvitation(inviteeUID);
                this.view.destroy();
            }
        },
        showPlayersList: function(response) {
            var playersList = new PlayersList({
                collection: new Backbone.Collection(response.users),
                button: this.view.ui.invite
            });
            this.view.showChildView('playersList', playersList);
            this.listenTo(playersList, 'player:selected', this.onSelectPlayer.bind(this));
        },
        onSelectPlayer: function(player) {
            this.selectedPlayer = player;
        }
    });

    return new BrokerController();
});
