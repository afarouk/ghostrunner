/*global define*/

'use strict';

define([
    'moment',
    '../appCache'
    ], function(moment, appCache){
    var previousModel,
        UID;

    var ChatMesssageModel = Backbone.Model.extend({
        initialize: function(attrs, options) {
            if (attrs.type === 'no-messages') return;
            var authorName = this.get('authorName'),
                authorNames = authorName.split(' '),
                shortAuthorName = (authorNames[0][0] + (authorNames[1] ? authorNames[1][0] : '')).toUpperCase(),
                timeStamp = this.get('timeStamp'),
                utc = typeof timeStamp === 'number' ? timeStamp : timeStamp.replace(':UTC', ''),
                localDate = moment.utc(utc).local(),
                date = this.getDate(localDate),
                localTime = localDate.format('LT');
            this.set('date', date, {silent: true});
            if (this.get('authorId') === UID) {
                this.set('me', true, {silent: true});
            } else {
                this.set('me', false, {silent: true});
            }
            this.set('shortAuthorName', shortAuthorName, {silent: true});
            console.log('date: ', date);
            this.set('localTime', localTime);
        },
        getDate: function(localDate) {
            return moment(localDate).calendar(null, {
                lastWeek: 'dddd',
                lastDay: '[Yesterday]',
                sameDay: '[Today]',
                sameElse: 'DD/MM/YYYY'
            });
        }
    });
    var ChatMessagesCollection = Backbone.Collection.extend({
        initialize: function(collection) {
            var user = appCache.get('user');
            UID = user.get('uid');
            if (collection.length === 0) {
                collection.push({type: 'no-messages'});
            }
            //check if doesn't have side effects
            this.on('add', this.checkWhatAdded.bind(this));
        },
        model: function(attrs, options) {
            var model = new ChatMesssageModel(attrs, options);
            //For display messages in Skype style
            if (!previousModel || previousModel.get('date') !== model.get('date')) {
                model.set('withDate', true, {silent: true});
            } else {
                model.set('withDate', false, {silent: true});
            }
            if (!previousModel || previousModel.get('authorId') !== model.get('authorId')) {
                model.set('withAvatar', true, {silent: true});
            } else {
                model.set('withAvatar', false, {silent: true});
            }
            previousModel = model;
            return model;
        },
        checkWhatAdded: function(model, collection, flags) {
            var toRemoveModel = collection.findWhere({type: 'no-messages'});
            if (toRemoveModel) {
                collection.remove(toRemoveModel);
            }
        }
    });
    return ChatMessagesCollection;
});