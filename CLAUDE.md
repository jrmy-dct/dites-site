# CLAUDE.md

## Documenter chaque PR

Les PR alimentent le journal des fonctionnalités du vault Studio et le site d'Ébullition permanente.
Un rattrapage automatique lit le titre et la description de chaque PR fusionnée. Écris-les pour un lecteur qui ne lit pas le code.

1. Écris le titre en français, du point de vue de l'utilisateur : ce qu'il gagne, pas ce que le code change.
2. Écris la description avec ces 4 sections :

```
## Pour l'utilisateur
Ce qui change pour lui, en 1 à 3 phrases.

## Type
nouvelle fonctionnalité | amélioration | correction | technique

## À mettre en avant
oui | non — oui seulement pour une nouvelle fonctionnalité visible par l'utilisateur.

## Technique
Ce qui a changé dans le code.
```

3. Si `docs/produit.md` existe et que la PR change le comportement du produit, mets ce fichier à jour dans la même PR.
4. Si le repo n'utilise pas de PR, écris le message de commit selon la règle 1.
5. Si `~/Studio` est accessible, ajoute aussi une entrée dans `~/Studio/Projets/<produit>/fonctionnalites.md` après la fusion.
