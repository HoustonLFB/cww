# 📋 Guide de saisie des données — Répertoire Diocésain

Ce dossier contient les gabarits pour la saisie des données du répertoire diocésain.
Chaque fichier correspond à un type d'entité. Remplissez-les en vous basant sur les exemples fournis.

## Fichiers

| Fichier | Description |
|---------|-------------|
| `01-diocese.md` | Informations générales sur le diocèse |
| `02-personnes.md` | Prêtres, diacres, séminaristes et autres personnes |
| `03-doyennes.md` | Liste des doyennés et leurs doyens |
| `04-ensembles-paroissiaux.md` | Ensembles paroissiaux et curé modérateur |
| `05-paroisses.md` | Paroisses avec leurs églises |
| `06-lieux-speciaux.md` | Séminaires, hôpitaux, prisons, écoles, communautés |

## Conventions

- **Coordonnées GPS** : format décimal (ex: 43.6082, 1.4420). Utilisez Google Maps (clic droit → coordonnées) ou OpenStreetMap
- **Identifiants** : chaque entité a un identifiant unique court. Utilisez des préfixes : `p-` (personne), `par-` (paroisse), `ep-` (ensemble paroissial), `doy-` (doyenné), `ls-` (lieu spécial)
- **Références** : quand un champ fait référence à une autre entité, utilisez son identifiant (ex: curé → `p-004`)
- **Champs optionnels** : les champs marqués *(optionnel)* peuvent être laissés vides

## Ordre de saisie recommandé

1. **Personnes** en premier (elles sont référencées partout)
2. **Doyennés** (structure hiérarchique haute)
3. **Ensembles paroissiaux** (rattachés aux doyennés)
4. **Paroisses** avec leurs églises (rattachées aux ensembles)
5. **Lieux spéciaux**
6. **Diocèse** (synthèse finale)
