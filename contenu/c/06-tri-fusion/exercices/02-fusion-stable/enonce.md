Un professeur a deux paquets de copies, chacun **déjà trié par note** croissante. Le paquet `a` était **au-dessus** du paquet `b` au départ, et les copies sont déjà rangées par ordre alphabétique dans chaque paquet. Il veut un seul paquet trié par note où, pour **une même note**, les copies restent dans l'ordre d'origine (celles de `a` d'abord).

```c
typedef struct {
    int note;
    char nom[8];
} Copie;
```

La fonction `fusionnerCopies(a, na, b, nb, resultat)` fusionne bien par note, mais elle ne respecte pas cette règle :

```text
a = (12, Alice) (15, Chloe)
b = (12, Bruno) (15, David)
attendu : Alice Bruno Chloe David
obtenu  : Bruno Alice David Chloe
```

Trouve le bug et corrige-le.

> [!info] Un tri stable
> Un tri est **stable** quand deux éléments égaux gardent leur ordre de départ. Le tri fusion l'est… seulement si la fusion est écrite comme il faut.
