Update combatants
set 
    namefighter = $1, 
    colorcode = $2, 
    actioncount = $3, 
    topcheck = $4, 
    acting = $5, 
    dead = $6,
    hidden = $7,
    max_health = $8,
    health = $9,
    fatigue = $10
where 
    id = $11
