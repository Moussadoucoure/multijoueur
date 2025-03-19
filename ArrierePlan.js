class ArrierePlan {
  constructor(scene) {
    this.scene = scene;
    this.conteneur = new createjs.Container();

    // Initialisation des variables
    this.images = {
      paysageArriere: new Image(),
      paysageAvant: new Image(),
      paysageSol: new Image(),
    };

    this.shapes = {
      paysageArriere: new createjs.Shape(),
      paysageAvant: new createjs.Shape(),
      paysageSol: new createjs.Shape(),
    };

    this.matrices = {
      paysageArriere: new createjs.Matrix2D(),
      paysageAvant: new createjs.Matrix2D(),
      paysageSol: new createjs.Matrix2D(),
    };

    // Chargement des images avec des écouteurs d'événements
    this.images.paysageArriere.src = "illustration/maisonpelouse7.png";
    this.images.paysageAvant.src = "illustration/arrierePlan2.png";
    this.images.paysageSol.src = "illustration/sol5.png";

    this.images.paysageArriere.addEventListener("load", () => this.creerShape("paysageArriere"));
    this.images.paysageAvant.addEventListener("load", () => this.creerShape("paysageAvant"));
    this.images.paysageSol.addEventListener("load", () => this.creerShape("paysageSol"));
  }

  // Crée un shape générique pour les différents éléments
  creerShape(type) {
    const image = this.images[type];
    const shape = this.shapes[type];
    const matrix = this.matrices[type];

    shape.graphics.beginBitmapFill(image, "repeat", matrix).drawRect(0, 0, 1919, 914).endStroke();
    console.log(`Shape ${type} créé`);
    this[`estCharge${type.charAt(0).toUpperCase() + type.slice(1)}`] = true;
  }

  // Vérifie si tous les éléments sont chargés
  get estCharge() {
    return Object.values(this.images).every(image => image.complete);
  }

  // Affiche tous les éléments du paysage
  afficher() {
    this.conteneur.addChild(this.shapes.paysageAvant);
    this.conteneur.addChild(this.shapes.paysageArriere);
    this.conteneur.addChild(this.shapes.paysageSol);
    this.conteneur.name = "arriere";
    this.scene.addChild(this.conteneur);
  }

  // Traite les demandes d'animation
  traiter(demande) {
    switch (demande) {
      case ArrierePlan.DEMANDE.ATTENDRE:
        this.etat = ArrierePlan.ETAT.ATTENTE;
        break;
      case ArrierePlan.DEMANDE.ALLER_A_DROITE:
        this.etat = ArrierePlan.ETAT.MOUVEMENT_A_DROITE;
        break;
    }
  }

  // Anime l'arrière-plan en fonction de l'état et du temps écoulé
  animer(secondeEcoulee) {
    // Déplacement des éléments en fonction des vitesses spécifiées
    this.matrices.paysageAvant.translate(-ArrierePlan.VITESSE_PIXEL_SECONDE.PAYSAGE_AVANT * secondeEcoulee, 0);
    this.matrices.paysageArriere.translate(-ArrierePlan.VITESSE_PIXEL_SECON
