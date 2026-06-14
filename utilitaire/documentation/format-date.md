# Formats de date courants

* il existe plusieurs manières de représenter une date ou une date/heure

  * format ISO-8601
  * timestamp Unix
  * jour julien

## Format ISO-8601

* c’est le format standard le plus utilisé aujourd’hui

* il est lisible par les humains

* il est largement utilisé dans :

  * les API REST
  * les bases de données
  * les applications web

* exemples :

```text
2026-06-14
```

```text
2026-06-14T18:30:00
```

```text
2026-06-14T18:30:00+03:00
```

* explication :

```text
2026-06-14
│    │  │
│    │  └── jour
│    └──── mois
└──────── année
```

* avec heure :

```text
2026-06-14T18:30:00
```

```text
18 = heure
30 = minute
00 = seconde
```

## Timestamp Unix

* un timestamp Unix est un nombre entier
* il représente le nombre de secondes écoulées depuis :

```text
01/01/1970 00:00:00 UTC
```

* exemple :

```text
1718375400
```

* avantages :

  * très rapide pour les calculs
  * facile à comparer
  * indépendant du format d’affichage

* inconvénient :

  * peu lisible pour un humain

Exemple :

```text
1718375400
```

correspond à une date réelle qui doit être convertie avant affichage.

## Jour julien

* le jour julien représente le nombre de jours écoulés depuis une date de référence très ancienne
* il est principalement utilisé dans :

  * l’astronomie
  * les calculs scientifiques
  * certains systèmes de bases de données

Exemple :

```text
2460476.5
```

* la partie entière représente le jour
* la partie décimale représente la fraction de la journée

## Recommandation

Pour un projet web ou une base SQLite :

* utiliser principalement le format ISO-8601

Exemples recommandés :

```text
2026-06-14
```

ou

```text
2026-06-14 18:30:00
```

ou

```text
2026-06-14T18:30:00
```

## Résumé rapide

* ISO-8601

  * lisible
  * standard
  * recommandé pour les API et applications

* Timestamp Unix

  * nombre de secondes depuis le 01/01/1970
  * pratique pour les calculs

* Jour julien

  * nombre de jours depuis une date de référence ancienne
  * utilisé principalement dans les domaines scientifiques
