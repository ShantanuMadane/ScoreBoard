#START STEPS
#npm i
#npm install pm2 -g
#cd scoreBoard/deploy/local
# pm2 start pm2.server.json



# STEPS TO REGISTER

POST CALL
Call http://52.66.6.0:3000/match/player_register  API which takes email,password and userName as parameters.


# STEPS TO LOGIN
POST CALL
Call http://52.66.6.0:3000/match/player_login API to login 

Login API will provide you token for using other API's

Use the token received from the login API to call player_score,player_stats,match_leaderboard, and player_stats_match API as bearer token for Authorization

# ScoreBoard
LeaderBoard

github Link - https://github.com/ShantanuMadane/ScoreBoard

POSTMAN LINK - https://www.getpostman.com/collections/12494b2c4dcfebf3d5ba

MATCH_NAME -  CSGO_MATCH_1,CSGO_MATCH_2,CSGO_MATCH_3
PLAYERID - UUzBW5Gtp,WmJuBnhaL,ULN2-X2Xh,h4yAAAvDQ,GbQudu_2u,bS0GjbDJf
#PlayerData
[
    {
        "_id" : ObjectId("5f6906cf6cd55dc9e1981314"),
        "playerId" : 1,
        "userName" : "Shantanu"
    },
    {
        "_id" : ObjectId("5f690eb59969a532c0f58cdd"),
        "userName" : "TTT",
        "playerId" : "UUzBW5Gtp"
    },
    {
        "_id" : ObjectId("5f6910741eecf0331483d840"),
        "userName" : "SSS",
        "playerId" : "WmJuBnhaL"
    },
    {
        "_id" : ObjectId("5f6910791eecf0331483d841"),
        "userName" : "UUU",
        "playerId" : "ULN2-X2Xh"
    },
    {
        "_id" : ObjectId("5f69107d1eecf0331483d842"),
        "userName" : "VVV",
        "playerId" : "h4yAAAvDQ"
    }
]

#match_data

[
    {
        "_id" : ObjectId("5f68fea42796ecb65338a44d"),
        "matchName" : "ABCD",
        "playerId" : 1.0,
        "kills" : 5.0,
        "score" : 100.0,
        "userName" : "Shantanu",
        "updatedAt" : 1600716422643.0
    },
    {
        "_id" : ObjectId("5f6910466cd55dc9e199dc43"),
        "matchName" : "CSGO_MATCH_1",
        "playerId" : "UUzBW5Gtp",
        "kills" : 8,
        "score" : 100,
        "updatedAt" : 1600720966292.0,
        "userName" : "TTT"
    },
    {
        "_id" : ObjectId("5f6910a26cd55dc9e199ed76"),
        "matchName" : "CSGO_MATCH_1",
        "playerId" : "WmJuBnhaL",
        "kills" : 10,
        "score" : 120,
        "updatedAt" : 1600721058702.0,
        "userName" : "SSS"
    },
    {
        "_id" : ObjectId("5f6910b66cd55dc9e199f0f4"),
        "matchName" : "CSGO_MATCH_1",
        "playerId" : "ULN2-X2Xh",
        "kills" : 9,
        "score" : 90,
        "updatedAt" : 1600721078502.0,
        "userName" : "UUU"
    },
    {
        "_id" : ObjectId("5f6910d26cd55dc9e199f57e"),
        "matchName" : "CSGO_MATCH_1",
        "playerId" : "h4yAAAvDQ",
        "kills" : 25,
        "score" : 200,
        "updatedAt" : 1600721106413.0,
        "userName" : "VVV"
    },
    {
        "_id" : ObjectId("5f6910e36cd55dc9e199f8f0"),
        "matchName" : "CSGO_MATCH_2",
        "playerId" : "h4yAAAvDQ",
        "kills" : 5,
        "score" : 55,
        "updatedAt" : 1600721123767.0,
        "userName" : "VVV"
    },
    {
        "_id" : ObjectId("5f6910fa6cd55dc9e199fc7c"),
        "matchName" : "CSGO_MATCH_2",
        "playerId" : "ULN2-X2Xh",
        "kills" : 15,
        "score" : 135,
        "updatedAt" : 1600721146350.0,
        "userName" : "UUU"
    },
    {
        "_id" : ObjectId("5f6911116cd55dc9e19a012a"),
        "matchName" : "CSGO_MATCH_2",
        "playerId" : "WmJuBnhaL",
        "kills" : 25,
        "score" : 220,
        "updatedAt" : 1600721169054.0,
        "userName" : "SSS"
    },
    {
        "_id" : ObjectId("5f6911256cd55dc9e19a0517"),
        "matchName" : "CSGO_MATCH_2",
        "playerId" : "UUzBW5Gtp",
        "kills" : 1,
        "score" : 10,
        "updatedAt" : 1601444202390.0,
        "userName" : "TTT"
    },
    {
        "_id" : ObjectId("5f82d7c8f57a7337622b5700"),
        "matchName" : "CSGO_MATCH_3",
        "playerId" : "bS0GjbDJf",
        "kills" : 3,
        "score" : 10,
        "updatedAt" : 1602410923088.0,
        "userName" : "Shanu"
    },
    {
        "_id" : ObjectId("5f831fa5f57a733762385f56"),
        "matchName" : "CSGO_MATCH_3",
        "playerId" : "GbQudu_2u",
        "kills" : 5,
        "score" : 40,
        "updatedAt" : 1602428837093.0,
        "userName" : "Shanu"
    }
]


