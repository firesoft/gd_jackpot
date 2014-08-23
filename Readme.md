GD Jackpot Service - api specs
---

### Routes:

##### GET / - service info

return info about service, example:
```
{"status":"online","name":"gd_jackpot","ip":"0.0.0.0","port":8088,"startTime":1408812425}
```

##### GET /jackpot - list of available jackpots values
##### GET /jackpot/:TYPE - jackpot value
 
##### GET /winners/:TYPE - list of jackpot winners, param: limit (def: 30)
##### GET /rules/:TYPE - list of rules for jackpot
 
:TYPE - one of [bingo, slots, videopoker, blackjack, poker, badbeat]


