/*global define */

'use strict';

define([
    '../Vent',
    '../views/informationTable',
    '../models/informationTable'
    ], function(Vent, InformationTableView, InformationTableModel){
    var InformationTableController = Mn.Object.extend({
            //TODO show interface
            //depending on model
    		create: function(layout, region) {
                this.model = new InformationTableModel;
    			this.view = new InformationTableView({
                    model: this.model
                });
    			layout.showChildView( region, this.view );
    		},
            opponentInGame: function(inGame) {
                this.model.set('opponentInGame', inGame);
            }
        });

    return new InformationTableController();
});
