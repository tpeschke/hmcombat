insert into combatants (namefighter, colorcode, actioncount, topcheck, acting, dead, idcombat, hidden, max_health, health, stress)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
returning id