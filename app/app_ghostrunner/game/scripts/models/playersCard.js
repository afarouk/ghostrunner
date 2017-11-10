/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var PlayersCardModel = Backbone.Model.extend({
    	defaults: {
            playerName: '[playerName]',
            season: '[season]',
            teamName: '[teamName]',
            imageURL: '[imageURL]',
            playerInfo: {
                'born': 'August 10, 1970',
                'height': '6\'4 ft',
                'weight': '220 lbs',
                'bats': 'Right',
                'throws': 'Right'
            },
            records: {
                batting: {
                    seasons: [
                        {
                            'Year': 1991,
                            'Age': 20,
                            'Lg': 'ARIZ',
                            'Lev': 'Rk',
                            'G': 30,
                            'PA': 103,
                            'AB': 88,
                            'R': 5,
                            'H': 18,
                            '2B': 1,
                            '3B': 1,
                            'HR': 0,
                            'RBI': 6,
                            'SB': 4,
                            'CS': 2,
                            'BB': 12,
                            'SO': 32,
                            'BA': .205
                        },
                        {
                            'Year': 1992,
                            'Age': 21,
                            'Lg': 'ARIZ',
                            'Lev': 'Rk',
                            'G': 24,
                            'PA': 96,
                            'AB': 81,
                            'R': 14,
                            'H': 14,
                            '2B': 6,
                            '3B': 1,
                            'HR': 1,
                            'RBI': 12,
                            'SB': 3,
                            'CS': 0,
                            'BB': 14,
                            'SO': 26,
                            'BA': .309
                        }
                    ]
                },
                fielding: {
                    seasons: [
                        {
                            'Year': 1991,
                            'Age': 20,
                            'Lg': 'ARIZ',
                            'Lev': 'Rk',
                            '...': 'OF',
                            'G': 29,
                            'Ch': 46,
                            'PO': 42,
                            'A': 2,
                            'E': 2,
                            'DP': 2,
                            'Fld%': .957,
                            'RF/G': 1.52,
                        },
                        {
                            'Year': 1992,
                            'Age': 21,
                            'Lg': 'ARIZ',
                            'Lev': 'Rk',
                            '...': 'OF',
                            'G': 23,
                            'Ch': 39,
                            'PO': 37,
                            'A': 1,
                            'E': 1,
                            'DP': 0,
                            'Fld%': .974,
                            'RF/G': 1.65,
                        }
                    ]
                }
            },
            position: {
                displayText: 'Second Base',
                enumText: 'FIELD_2B',
                id: 4
            },
            role: {
                displayText: 'Outfield',
                enumText: 'OUTFIELDER',
                id: 1
            }
        },

        initialize: function() {
            this.calculateRecordsSums();
        },

        calculateRecordsSums: function() {
            var records = this.get('records'),
                battingRecords = records.batting,
                fieldingRecords = records.fielding;
            battingRecords.seasonsSum = {};
            fieldingRecords.seasonsSum = {};

            //calculate batting sum
            _.each(battingRecords.seasons, function(season){
                _.each(season, function(value, field){
                    switch(field) {
                        //Year| Age|    Lg| Lev|    G|  PA| AB| R|  H|  2B| 3B| HR| RBI|    SB| CS| BB| SO| BA
                        case 'Year':
                        case 'Age':
                        case 'Lg':
                        case 'Lev':
                            break;
                        // case 'BA':
                        //     break;
                        default:
                            if (battingRecords.seasonsSum[field]) {
                                battingRecords.seasonsSum[field] += value;
                            } else {
                                battingRecords.seasonsSum[field] = value;
                            }
                            break;
                    }
                });
            });
            battingRecords.seasonsSum['BA'] /= battingRecords.seasons.length; //not sure that it is proper calculation method
            //calculate fielding sum
            _.each(fieldingRecords.seasons, function(season){
                _.each(season, function(value, field){
                    switch(field) {
                        //Year| Age|    Lg| Lev|    ...|    G|  Ch| PO| A|  E|  DP| Fld%|   RF/G
                        case 'Year':
                        case 'Age':
                        case 'Lg':
                        case 'Lev':
                        case '...':
                            break;
                        default:
                            if (fieldingRecords.seasonsSum[field]) {
                                fieldingRecords.seasonsSum[field] += value;
                            } else {
                                fieldingRecords.seasonsSum[field] = value;
                            }
                            break;
                    }
                });
            });
            fieldingRecords.seasonsSum['Fld%'] /= fieldingRecords.seasons.length; //not sure that it is
            fieldingRecords.seasonsSum['RF/G'] /= fieldingRecords.seasons.length; //proper calculation method
            console.log(this.toJSON());
        }
    });
    return PlayersCardModel;
});
