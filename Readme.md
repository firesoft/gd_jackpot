GD Jackpot Service - api specs
---

### Routes

##### GET / - service info

 - GET /jackpot - list of available jackpots values
 - GET /jackpot/:TYPE - jackpot value
 
 - GET /winners/:TYPE - list of jackpot winners, param: limit (def: 30)
 - GET /rules/:TYPE - list of rules for jackpot
 
:TYPE - one of [bingo, slots, videopoker, blackjack, poker, badbeat]


