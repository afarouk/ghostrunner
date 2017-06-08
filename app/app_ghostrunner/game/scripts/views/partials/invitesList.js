/*global define */

'use strict';

define([
	'ejs!../../templates/partials/myInvite.ejs'
	], function(template){
	var InviteView = Mn.View.extend({
		tagName: 'li',
		className: 'my-game',
		template: template,
	});

	var InvitesListView = Mn.CollectionView.extend({
		className: 'games-list',
		tagName: 'ul',
		childView: InviteView
	});
	return InvitesListView;
});