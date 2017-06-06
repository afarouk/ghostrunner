/*global define */

'use strict';

define([
    '../../views/gameField'
    ], function(GameFieldView){
    var GameFieldController = Mn.Object.extend({
		create: function(layout, region) {
			this.view = new GameFieldView();
			layout.showChildView( region, this.view );
		}
    });

    return new GameFieldController();
});
