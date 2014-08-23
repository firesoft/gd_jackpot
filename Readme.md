GD Jackpot Service - api specs
---

### Routes:

##### GET / - service info

return info about service, example:
```
{"status":"online","name":"gd_jackpot","ip":"0.0.0.0","port":8088,"startTime":1408812425}
```

##### GET /jackpot - list of available jackpots values
example:
```
{"bingo":"1871234","videopoker":"98657","slots":0,"blackjack":0,"poker":0,"badbeat":0}
```
##### GET /jackpot/:TYPE - jackpot value
example:
```
{"value":"98657"}
```
 
##### GET /winners/:TYPE - list of jackpot winners, query param: limit (def: 30)
example:
```
[{"playerId":66,"timeAwarded":1408556144,"gameNumber":3000,"cards":"sjdhf8","moneyWon":12894},{"playerId":78,"timeAwarded":1408556144,"gameNumber":3001,"cards":"woief","moneyWon":92837}]
```
##### GET /rules/:TYPE - list of rules for jackpot
example for type=poker
```
{"minimalCards":[{"gameNumber":3000,"cards":"2asd34"},{"gameNumber":3001,"cards":"24ksjdhf2"},{"gameNumber":3006,"cards":"zxczxczxc"}]}
``` 

example for type=slots
```
{"percentRules":[{"cost":10,"percent":20},{"cost":100,"percent":40},{"cost":1000,"percent":80}]}
```

example for type=badbeat
```
{"percentRules":[{"prizeType":"loser","percent":50},{"prizeType":"winner","percent":25},{"prizeType":"participant","percent":25}],"minimalCards":"ppppppppppp"}
```

:TYPE - one of [bingo, slots, videopoker, blackjack, poker, badbeat]


