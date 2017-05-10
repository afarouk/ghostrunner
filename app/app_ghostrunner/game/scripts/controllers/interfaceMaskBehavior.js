/*global define, _, Mn*/
'use strict';

define([
], function(){

    return Mn.Behavior.extend({
        events: {
            
        },
        initialize: function() {
            this.listenTo(this.view, 'updateMask', this.updateMask, this);
        },
        onRender: function() {
            this.model = this.view.model;
        },
        updateMask: function() {
            
        }
    });
});
