# SOREMED — production performance pass

8 septembre 2026. Patch incrémental, identité et fonctionnement métier préservés.

## Protocole

`npm run build` puis `npm start -- -p 3001`, avec comparaison à `npm run dev` sur 3000.
Mesures dans le navigateur Chromium intégré, sans émulation CPU ou matériel mobile.
Le diagnostic opt-in `/?entry-profile=1` échantillonne requestAnimationFrame pendant 16 secondes et observe les tâches longues (>50 ms). Résultat dans l’élément DOM masqué `[data-entry-profile]`. Aucun échantillonnage ni chargement du module diagnostic lors d’une visite normale.

Ces intervalles indiquent la cadence des callbacks, pas une mesure GPU/compositeur ni une certification 60 FPS. Les actions de pointeur sont réalisées via le navigateur. Un onglet non affiché a subi un bridage à environ 1 Hz ; ce résultat n’est pas utilisé comme comparaison de fluidité interactive. Deux intervalles de démarrage bridés sont également présents dans le dernier échantillon visible, avant interaction.

## Résultats observés

| Échantillon | Ouverture : p95 | Ouverture : maximum | Intervalles >33,4 ms pendant l’ouverture | Tâches longues sur 16 s |
| --- | ---: | ---: | ---: | ---: |
| Production initiale | 6,2 ms | 42,5 ms | 1 | 0 |
| Développement initial | 12,1 ms | 84,9 ms | 1 | 1 (79 ms) |
| Production après orchestration | 6,1 ms | 30,2 ms | 0 | 0 |
| Production finale, 1280×720 | 6,1 ms | 30,3 ms | 0 | 0 |
| Développement final, 1280×720 | 6,1 ms | 36,4 ms | 1 | 0 |

Mesures indicatives sur ce poste, non extrapolables à tous les appareils. Les intervalles typiques d’environ 6 ms correspondent à la cadence du navigateur sur ce poste.

## Modifications ciblées

- Préparation du layout de l’accueil derrière la scène opaque : suppression de `content-visibility:hidden`, maintien de `visibility:hidden` et de `inert`. Le site reste invisible et non interactif avant le clic.
- Réseau pré-monté, mais immobile jusqu’à la fin de l’entrée : suppression du montage et des animations concurrentes au clic.
- Orbite et nœuds : mêmes mouvements, désormais en CSS transform au lieu de boucles Framer Motion répétées. Pause hors viewport, onglet masqué, entrée active et préférence de mouvement réduit.
- Mobile : pas de parallaxe du réseau, de déplacement des nœuds, d’orbite ou de curseur personnalisé.
- Pointeur de l’entrée arrêté immédiatement au clic ; lumière atténuée pendant l’ouverture. Aucun état React mis à jour au rythme du pointeur.
- Curseur conservé, compression par transform au lieu d’animation de largeur/hauteur.
- Décor WebP conservé : 103 960 octets desktop et 46 746 octets mobile, source responsive, priorité haute et décodage asynchrone déjà en place. Aucun filtre plein écran animé ajouté.
- Masque d’ouverture et typographie conservés ; aucun nouvel effet décoratif.

## Vérifications

- Build production et TypeScript réussis.
- Réseau hors écran : `data-animation-active=false`, animation CSS `paused`.
- L’entrée reste manuelle ; sa transition ne change pas de route.
- Aucun changement aux comptes, commandes, documents ou données.
