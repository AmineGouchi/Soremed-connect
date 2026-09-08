# SOREMED Connect — Entry V4 et identité officielle

Vérification du 8 septembre 2026. Travail incrémental sur le projet existant.

## Identité

- Source unique et intacte : `public/branding/SOREMED.png`.
- Composant `OfficialLogo` partagé par l'entrée, la navigation, l'authentification, l'onboarding, l'espace client, le réseau, l'aperçu du dashboard et le footer.
- Mise à jour branding : aucun fond rapporté. Sur support clair, le canal alpha du PNG officiel sert de masque vert profond (#0a392f) ; sur support sombre, l’image originale claire est conservée. Le fichier source reste intact.
- « Connect » est retiré du bloc logo partagé et de l’aperçu du dashboard ; le nom du produit reste dans les contenus et métadonnées.
- Deux rappels décoratifs seulement : panneau d'authentification et CTA final. Masqués sur petit écran.
- Suppression des anciennes marques SR et du carré factice dans l'aperçu.

## Entrée et interactions

- Entrée persistante, exclusivement déclenchée par le bouton (ou son activation clavier).
- Aucun cookie ou stockage « déjà vu », aucun délai de sortie automatique.
- Actualisation : retour systématique à l'entrée.
- Contrôle centré de 304 × 64 px, coins de 12 px ; mobile 286 × 62 px.
- Repos : fond #fbfcf9 et texte #0a392f. Survol : fond #1c7a5c et texte blanc, transition 340 ms.
- Texte masqué : « Entrer dans l'expérience » → « Explorer SOREMED ».
- Aperture calculée depuis le bouton jusqu'au coin le plus distant ; scroll et accueil restent verrouillés jusqu'à la fin.
- Focus clavier contenu dans l'entrée, puis transféré au titre de l'accueil.
- Mouvement du curseur immédiat ; une seule boucle rAF à la demande pour le décor. Aucun rendu React à la fréquence du pointeur.
- Suppression des filtres de 52 px, des transitions de décor de 900 ms, de la boucle de curseur permanente et des anciennes couches CSS.
- Pas de WebGL ajouté. Mise à jour performance : réseau pré-monté mais immobile derrière l’entrée, animation activée seulement après l’ouverture et lorsqu’il est visible.
- Compteurs conservés, avec nettoyage rAF, progression bornée et mise à jour DOM sans rerendu React par frame.

## Rendus et contrôles exécutés

Captures inspectées dans le navigateur Chromium intégré :
1920×1080, 1536×864, 1440×900, 1366×768, 1280×800, 1024×768,
430×932, 412×915, 390×844, 375×812 et 360×800.

Les assertions DOM ont vérifié le bouton dans le viewport, les lettres non coupées, l'absence de débordement horizontal et la navbar masquée avant entrée.
Attente sans clic : 33 secondes sur desktop/tablette, 86 secondes à 430×932 et 139 secondes à 1024×768 dans la passe finale, entrée toujours prête et scroll verrouillé.
Clic, survol, entrée au clavier, transfert de focus et retour après actualisation vérifiés.
Connexion, inscription mobile, onboarding, navbar flottante, footer et dashboard desktop/mobile inspectés.
La carte de bienvenue mobile possède désormais un espacement de 20 px entre le texte et l'action, sans chevauchement.
Aucune erreur ou alerte console collectée pendant le parcours vérifié.
`npm run build` et vérification TypeScript réussis.

Limites : contrôles de viewport, pas de test sur matériel iOS/Android physique ; aucun score Lighthouse ou résultat FPS certifié n'est revendiqué.
Le fonctionnement métier et les données de comptes n'ont pas été modifiés.

## Fond architectural

Créé avec le skill imagegen et l'outil imagegen intégré, puis exporté en WebP pour le site :
- `public/visuals/soremed-distribution.webp` — 103 960 octets.
- `public/visuals/soremed-distribution-mobile.webp` — 46 746 octets.

Ce décor conceptuel ne représente pas un entrepôt SOREMED réel.
Le logo officiel n'a pas été utilisé comme cible de génération.

Prompt de génération :

Create one photorealistic architectural photograph for a premium Moroccan pharmaceutical distributor's full-screen brand entry page, wide 16:9 landscape 2560x1440. NO text, NO logo, NO graphic overlay. Scene: cinematic distribution space, meticulously designed dark forest-green architecture with a deep receding warehouse-like aisle. Tall translucent fluted glass partitions and deep green structural panels frame the left and right edges, precise repeated rectangular bays recede softly into the distance; low quiet rectangular pale mineral/packaging-inspired volumes at the far edges. Center and upper-middle remain calm dark negative space for huge white typography added later. A restrained white-sage daylight opening deep in the corridor, slightly off-center, with soft atmospheric light and very subtle haze, low-key exposure. Floor honed dark stone with faint softly reflected light, not a wet glossy mirror. Real physical materials, glass imperfections, natural surface grain, restrained volumetric shadows, tactile luxury architectural editorial photography shot with a 35mm lens. Detail around edges, generous calm central space. Premium healthcare brand film, trust, precision and movement conveyed by architectural depth. Green-black and desaturated sage palette, muted warm mineral accents only. Not an empty abstract gradient. No circular portals, arches, spheres, pills, plants, medical crosses, people, neon, sci-fi tunnels, grids, HUD, digital network, lens flare, technical diagrams. Looks photographed, not a computer-generated sci-fi concept.
