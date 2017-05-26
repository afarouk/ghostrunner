/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var InformationTableModel = Backbone.Model.extend({
    	defaults: {
            thisUser: {  
                user: {
                    userName: "Computer",
                    imageURL: null
                },
                team: {
                    city: 'Boston, 2012',
                    currentPlayer: {
                        role: 'Batter',
                        name: 'Ellsbury, Jacoby',
                        skills: [
                            {
                                skillName: 'Base Running',
                                levelName: 'Excellent',
                                level: 5
                            },
                            {
                                skillName: 'Speed',
                                levelName: 'Good',
                                level: 4
                            },
                            {
                                skillName: 'Bat Control',
                                levelName: 'Excellent',
                                level: 5
                            },
                            {
                                skillName: 'Clutch Batting',
                                levelName: 'Good',
                                level: 4
                            }
                        ]
                    },
                    players: [
                        {
                            playerName: 'Ellbury, Jacoby',
                            position: 'CF'
                        },
                        {
                            playerName: 'Pendole, Dustin',
                            position: '2B'
                        },
                        {
                            playerName: 'Gonzalez, Adrian',
                            position: '1B'
                        },
                        {
                            playerName: 'Ortlz, David',
                            position: 'DH'
                        },
                        {
                            playerName: 'Middlebrooks, Will',
                            position: '3B'
                        }
                    ]
                }
            },
            otherUser: {  
                user: {  
                    userName: "Vasyl",
                    imageURL: null
                },
                team: {
                    city: 'Lviv, 2012',
                    currentPlayer: {
                        role: 'Pitcher',
                        name: 'Lucas, George',
                        skills: [
                            {
                                skillName: 'Matchup Rating',
                                levelName: 'Excellent',
                                level: 5
                            },
                            {
                                skillName: 'Stamina',
                                dynamic: true,
                                levelName: null,
                                level: 13,
                                currentLevel: 13
                            }
                        ]
                    },
                    players: [
                        {
                            playerName: 'Lucas, George',
                            position: 'CF'
                        },
                        {
                            playerName: 'Abrams, Jeffrey',
                            position: '2B'
                        },
                        {
                            playerName: 'Kubrick, Stanley',
                            position: '1B'
                        },
                        {
                            playerName: 'Tarkovsky, Andrei',
                            position: 'DH'
                        },
                        {
                            playerName: 'Allen, Woody',
                            position: '3B'
                        }
                    ]
                }
            },
            scoresTable: {
                displayText: "American League Game",
                thisTeam: {
                    city: 'Boston',
                    scores: [
                        {
                            round: 1,
                            scores: 0
                        },
                        {
                            round: 2,
                            scores: 1
                        },
                        {
                            round: 3,
                            scores: 0
                        },
                    ]
                },
                otherTeam: {
                    city: 'Lviv',
                    scores: [
                        {
                            round: 1,
                            scores: 1
                        },
                        {
                            round: 2,
                            scores: 0
                        },
                        {
                            round: 3,
                            scores: 1
                        }
                    ]
                }
            }
        },
        initialize: function() {
            
        }
    });
    return InformationTableModel;
});
