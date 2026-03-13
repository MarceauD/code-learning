📝 Document de Synthèse : Plateforme d'Apprentissage Web Interactive
1. Vision et Objectif du Produit

L'application est une plateforme d'apprentissage de la programmation web, conçue spécifiquement pour guider les débutants à travers la pratique directe. L'objectif est d'éviter le copier-coller passif de code généré par IA en proposant des exercices interactifs, progressifs et autocorrigés directement dans le navigateur (chasse aux bugs, code à compléter, implémentation de maquettes simples).

L'application se destine à être utilisée uniquement par mon frère qui s'appelle Quentin. Il faut que l'application soit personnalisé à lui. Il parle hébreu et nous pouvons donc faire apparaitre les textes de salutations, d'encouragements, de réussite et d'erreurs en hébreu dans la page, comme un joli clin d'oeil.

2. Stack Technique (Architecture "Full Frontend")

Nous avons opté pour une architecture 100 % client (sans backend complexe), privilégiant la rapidité d'exécution, la gratuité de l'hébergement et la simplicité de maintenance.

    Framework UI : React (via Vite). Pour une navigation fluide sans rechargement de page (Single Page Application) et un démarrage ultra-rapide du projet.

    Environnement de Code Intégré : Sandpack (par CodeSandbox). C'est le cœur du réacteur. Il permet d'exécuter du code HTML/CSS/JS directement dans le navigateur de l'utilisateur avec un rendu visuel en temps réel et sécurisé.

    Moteur de Validation : JavaScript natif (Client-side). L'évaluation des exercices se fait via des expressions régulières (analyse de la syntaxe du code tapé) ou via l'API DOM (vérification du résultat visuel, ex: "Le bouton est-il bien rouge ?").

    Données : Fichiers JSON statiques. Les cours et exercices sont stockés dans des fichiers de configuration, rendant l'ajout de nouveau contenu extrêmement simple sans toucher au code de l'application.

    Hébergement recommandé : Vercel, Netlify ou GitHub Pages (Déploiement continu, gratuit et rapide).

3. Curriculum "Programmation Web" (Exemples d'exercices)

Voici une proposition de progression pédagogique découpée en 3 chapitres fondateurs, avec une dizaine de micro-exercices pour chacun. La difficulté augmente de manière granulaire.
Chapitre 1 : Les Fondations (HTML)

Objectif : Comprendre la structure, les balises et la sémantique.

    Le point d'entrée : Remplacer le texte d'une balise <h1>.

    Chasse au bug : Trouver et fermer une balise <p> mal refermée.

    Organisation : Créer une liste à puces (<ul> et <li>) pour des courses.

    Interaction basique : Ajouter un bouton <button> dans la page.

    Les liens : Transformer un texte en lien hypertexte (<a> et attribut href).

    Chasse au bug : Réparer une image cassée (corriger l'attribut src et ajouter alt).

    Sémantique : Remplacer des <div> par des balises <header>, <main> et <footer>.

    Formulaire (Partie 1) : Ajouter un champ de texte (<input>).

    Formulaire (Partie 2) : Ajouter des cases à cocher (<input type="checkbox">).

    Le défi HTML : Construire la structure complète d'une carte de profil (Titre, image, description, bouton).

Chapitre 2 : Le Design (CSS)

Objectif : Comprendre les sélecteurs, le modèle de boîte et le placement.

    Peinture fraîche : Changer la couleur (color) d'un titre.

    L'arrière-plan : Mettre le fond de la page en gris (background-color).

    Chasse au bug : Comprendre pourquoi la règle #titre (ID) ne s'applique pas à une balise <div class="titre"> (Classe).

    Respirer (Marges internes) : Ajouter du padding à un bouton pour l'agrandir.

    Prendre ses distances (Marges externes) : Espacer deux paragraphes avec margin.

    Encadrer : Ajouter une bordure (border) solide et noire à une image.

    Magie de la disparition : Cacher un élément gênant avec display: none.

    Flexbox (Partie 1) : Aligner trois boutons horizontalement.

    Flexbox (Partie 2) : Centrer parfaitement un bloc au milieu de la page (justify-content et align-items).

    Le défi CSS : Styliser complètement la carte de profil du Chapitre 1 pour la faire ressembler à un vrai composant UI.

Chapitre 3 : La Logique (JavaScript)

Objectif : Rendre la page interactive et modifier le DOM.

    La console : Afficher un message de bienvenue avec console.log().

    La mémoire : Créer une variable let pour stocker le nom de l'utilisateur.

    Chasse au bug : Corriger une erreur de syntaxe empêchant le script de s'exécuter.

    Ciblage : Sélectionner le bouton de la page avec document.querySelector().

    Écouteur d'événement : Ajouter un addEventListener('click') sur un bouton.

    Action / Réaction : Faire apparaître une alert() au clic.

    Manipulation du DOM : Changer le texte d'un paragraphe via .innerText après un clic.

    Logique conditionnelle : Utiliser if/else (ex: si le texte est 'A', le changer en 'B', sinon en 'A').

    Toggle CSS : Ajouter ou retirer une classe CSS dynamiquement (classList.toggle()) pour faire un mode sombre.

    Le défi JS : Créer un vrai bouton compteur qui s'incrémente de +1 à chaque clic et l'afficher dans la page.