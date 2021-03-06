GD Jackpot Service - api specs
---

Jackpot service - returns info about jackpot values, rules and winners in json format using http protocol.

### Routes:

##### GET / - service info
return info about service, return example:
```
{"status":"online","name":"gd_jackpot","ip":"0.0.0.0","port":8088,"startTime":1408812425}
```

##### GET /jackpot - list of available jackpots values
return example:
```
{"bingo":"1871234","videopoker":"98657","slots":0,"blackjack":0,"poker":0,"badbeat":0}
```
##### GET /jackpot/:TYPE - jackpot value
example:
```
{"value":"98657"}
```
 
##### GET /winners/:TYPE - list of jackpot winners, query param: limit (def: 30)
return example:
```
[{"playerId":66,"timeAwarded":1408556144,"gameNumber":3000,"cards":"sjdhf8","moneyWon":12894},{"playerId":78,"timeAwarded":1408556144,"gameNumber":3001,"cards":"woief","moneyWon":92837}]
```
##### GET /rules/:TYPE - list of rules for jackpot
return example for type=poker
```
{"minimalCards":[{"gameNumber":3000,"cards":"2asd34"},{"gameNumber":3001,"cards":"24ksjdhf2"},{"gameNumber":3006,"cards":"zxczxczxc"}]}
``` 

return example for type=slots
```
{"percentRules":[{"cost":10,"percent":20},{"cost":100,"percent":40},{"cost":1000,"percent":80}]}
```

return example for type=badbeat
```
{"percentRules":[{"prizeType":"loser","percent":50},{"prizeType":"winner","percent":25},{"prizeType":"participant","percent":25}],"minimalCards":"ppppppppppp"}
```

##### TYPE param
:TYPE - type parameter is one of [bingo, slots, videopoker, blackjack, poker, badbeat]

##### errors
in case of error service will return one of the following errors (with http status):

 * status 404 - not found
 ```
 {"message":"four - oh - four"}
 ```

 * status 400 - bad request - in case of incorrect parameters
 ```
 {"message":"Invalid type param."}
 ```
 
 * status 500 - internal service error
 ```
 {"message":"Internal server error."}
 ```