class ArrierePlan{
  constructor(scene){
    this.scene = scene;
    this.conteneur = new createjs.Container();

    this.estChargePaysageArriere = false;
    this.shapePaysageArriere = new createjs.Shape();
    this.matricePaysageArriere = new createjs.Matrix2D();
    this.imagePaysageArriere = new Image();
    this.imagePaysageArriere.addEventListener("load", evenementloadpaysagearriere => this.creerShapePaysageArriere(evenementloadpaysagearriere));
    this.imagePaysageArriere.src = "illustration/maisonpelouse7.png"

    this.estChargePaysageAvant = false;
    this.shapePaysageAvant = new createjs.Shape();
    this.matricePaysageAvant = new createjs.Matrix2D();
    this.imagePaysageAvant = new Image();
    this.imagePaysageAvant.addEventListener("load", evenementloadpaysageavant => this.creerShapePaysageAvant(evenementloadpaysageavant));
    this.imagePaysageAvant.src = "illustration/arrierePlan2.png"

    this.estChargePaysageSol = false;
    this.shapePaysageSol = new createjs.Shape();
    this.matricePaysageSol = new createjs.Matrix2D();
    this.imagePaysageSol = new Image();
    this.imagePaysageSol.addEventListener("load", evenementloadpaysagesol => this.creerShapePaysageSol(evenementloadpaysagesol));
    this.imagePaysageSol.src = "illustration/sol5.png"



  }

  creerShapePaysageArriere(evenementloadpaysagearriere){

    this.shapePaysageArriere.graphics.beginBitmapFill(this.imagePaysageArriere, "repeat", this.matricePaysageArriere).drawRect(0,0,1919,914).endStroke();
    console.log("creerShapePaysageArriere");
    this.estChargePaysageArriere = true;
  }

  creerShapePaysageAvant(evenementloadpaysageavant){

    this.shapePaysageAvant.graphics.beginBitmapFill(this.imagePaysageAvant, "repeat", this.matricePaysageAvant).drawRect(0,0,1919,914).endStroke();
    this.estChargePaysageAvant = true;
  }

  creerShapePaysageSol(evenementloadpaysagesol){

    this.shapePaysageSol.graphics.beginBitmapFill(this.imagePaysageSol, "repeat", this.matricePaysageSol).drawRect(0,0,1919,914).endStroke();
    this.estChargePaysageSol = true;
  }



  get estCharge(){
    return this.estChargePaysageArriere && this.estChargePaysageAvant && this.estChargePaysageSol;
  }

  afficher(){
   this.conteneur.addChild(this.shapePaysageAvant);
   this.conteneur.addChild(this.shapePaysageArriere);

   this.conteneur.addChild(this.shapePaysageSol);
   this.conteneur.name = "arriere";
   this.scene.addChild(this.conteneur);
  }


  traiter(demande){
    switch(demande){
      case ArrierePlan.DEMANDE.ATTENDRE:
        this.etat = ArrierePlan.DEMANDE.ATTENDRE;
        break;
      case ArrierePlan.DEMANDE.ALLER_A_DROITE:
        this.etat = ArrierePlan.DEMANDE.MOUVEMENT_A_DROITE;
        break;


    }

  }

  animer(secondeEcoulee){
    this.matricePaysageAvant.translate(-ArrierePlan.VITESSE_PIXEL_SECONDE.PAYSAGE_AVANT * secondeEcoulee, 0);
    this.matricePaysageArriere.translate(-ArrierePlan.VITESSE_PIXEL_SECONDE.PAYSAGE_ARRIERE * secondeEcoulee, 0);
    switch(this.etat){
      case ArrierePlan.ETAT.ATTENTE:
        break;

      case ArrierePlan.ETAT.MOUVEMENT_A_DROITE:
        this.matricePaysageSol.translate(-ArrierePlan.VITESSE_PIXEL_SECONDE.SOL * secondeEcoulee, 0);
        break;

    }
  }

}
ArrierePlan.DEMANDE = {
  ATTENDRE : 0,
  MOUVEMENT_A_DROITE : 1

}

ArrierePlan.ETAT = {
  ATTENTE : 0,
  MOUVEMENT_A_DROITE : 1

}

ArrierePlan.VITESSE_PIXEL_SECONDE = {
  PAYSAGE_ARRIERE : 15,
  PAYSAGE_AVANT : 50,
  SOL : 70

}
