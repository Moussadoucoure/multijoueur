   class PersonnageRouge{
     constructor(scene){
         this.scene = scene;
         this.estCharge = false;
         this.image = new Image();
         this.image.addEventListener("load", evenementload => this.creerSprite(evenementload));
         this.image.src = "illustration/joueur2.png";
         this.debutSaut = 0;

    }

    creerSprite(evenementload){
        console.log("Image personnage.png chargee");

        let spriteSheetPersonnage = new createjs.SpriteSheet({
            images: [this.image],

            frames:{
            width: 133.16,
            height:170
            },

            animations:{
            marcher:[0,4],
            pause:[0]
            }
        });
        console.log("SpriteSheetPersonnage cree");

        this.spritePersonnage = new createjs.Container();
        this.spritePersonnagePause = new createjs.Sprite(spriteSheetPersonnage, "pause");
        this.spritePersonnagemarche = new createjs.Sprite(spriteSheetPersonnage, "marcher");
        this.spritePersonnagemarche.visible = false;

        this.spritePersonnage.addChild(this.spritePersonnagePause);
        this.spritePersonnage.addChild(this.spritePersonnagemarche);

        this.spritePersonnage.setBounds(
            this.spritePersonnage.x,
            this.spritePersonnage.y,
            133.16,
            170  );
        this.estCharge = true;
        console.log("spritePersonnage cree");

    }

    afficher(){
        this.spritePersonnage.x = 200;
        this.spritePersonnage.y = 630;
        this.spritePersonnage.name= "personnage";
        this.scene.addChild(this.spritePersonnage);
        console.log("spritePersonnage ajoutee a la scene");
    }

    avancer(secondeEcoulee){

        this.spritePersonnage.x = this.limiterMouvement(this.spritePersonnage.x + PersonnageRouge.VITESSE_PIXEL_SECONDE * secondeEcoulee, this.spritePersonnage.y).x;
    }

    reculer(secondeEcoulee){

        this.spritePersonnage.x = this.limiterMouvement(this.spritePersonnage.x - PersonnageRouge.VITESSE_PIXEL_SECONDE * secondeEcoulee, this.spritePersonnage.y).x;
    }

    monter(secondeEcoulee){
    this.spritePersonnage.y = this.limiterMouvement(this.spritePersonnage.x, this.spritePersonnage.y - PersonnageRouge.VITESSE_PIXEL_SECONDE * secondeEcoulee).y;
  }
   descendre(secondeEcoulee){
    this.spritePersonnage.y = this.limiterMouvement(this.spritePersonnage.x, this.spritePersonnage.y + PersonnageRouge.VITESSE_PIXEL_SECONDE * secondeEcoulee).y;
  }

   sauter(secondeEcoulee){
     if(!this.debutSaut){
       this.debutSaut = Date.now();
    }
    let tempsActuel = Date.now();
    if(tempsActuel- this.debutSaut < PersonnageRouge.DUREE_SAUT / 2){
      this.monter(secondeEcoulee);

    }else{
      this.descendre(secondeEcoulee)
    }
    if(tempsActuel - this.debutSaut >= PersonnageRouge.DUREE_SAUT){
      this.debutSaut = 0;
      this.etat = PersonnageRouge.ETAT.ATTENTE;
    }


  }




    limiterMouvement(testX, testY){
    let nouveauX = testX;
    let nouveauY = testY;

    if(testX + this.spritePersonnage.getBounds().width > this.scene.largeur){
      nouveauX  = this.scene.largeur - this.spritePersonnage.getBounds().width;
    }else if(testX < 0){
      nouveauX = 0;
    }
    if(testY + this.spritePersonnage.getBounds().height > 800){
      nouveauY  = 800 - this.spritePersonnage.getBounds().height;
    }else if(testY < 0){
      nouveauY = 0;
    }

    console.log("limiterMouvement {x: nouveauX}",{x: nouveauX});
    return {x: nouveauX, y: nouveauY };

  }

  traiter(demande){
    if(this.etat  != PersonnageRouge.ETAT.MOUVEMENT_EN_SAUT){
      switch(demande){
        case PersonnageRouge.DEMANDE.ATTENDRE:
          this.etat = PersonnageRouge.ETAT.ATTENTE;
          break;
        case PersonnageRouge.DEMANDE.ALLER_A_DROITE:
          this.etat = PersonnageRouge.ETAT.MOUVEMENT_A_DROITE;
          break;
        case PersonnageRouge.DEMANDE.ALLER_A_GAUCHE:
          this.etat = PersonnageRouge.ETAT.MOUVEMENT_A_GAUCHE;
          break;
        case PersonnageRouge.DEMANDE.SAUTER:
          this.etat = PersonnageRouge.ETAT.MOUVEMENT_EN_SAUT;
          break;

      }
    }


  }

  animer(secondeEcoulee){
    switch(this.etat){
      case PersonnageRouge.ETAT.ATTENTE:
        this.spritePersonnagemarche.visible = false;
        this.spritePersonnagePause.visible = true;

        break;
      case PersonnageRouge.ETAT.MOUVEMENT_A_DROITE:
        this.avancer(secondeEcoulee);
        this.spritePersonnagemarche.visible = true;
        this.spritePersonnagePause.visible = false;
        break;
      case PersonnageRouge.ETAT.MOUVEMENT_A_GAUCHE:
        this.reculer(secondeEcoulee);
        break;
      case PersonnageRouge.ETAT.MOUVEMENT_EN_SAUT:
        this.sauter(secondeEcoulee);
        break;


    }
  }

  determinerRectangleOccupe(){
    return {
      x: this.spritePersonnage.x,
      y: this.spritePersonnage.y,
      largeur: this.spritePersonnage.getBounds().width,
      hauteur: this.spritePersonnage.getBounds().height
    };
  }

  estVisible(){
      return this.spritePersonnage.isVisible();
    }
  setVisibilite(visible){
      this.spritePersonnage.visible = visible;
    }

  clignoter() {
        let clignotementCount = 0;
        const intervalID = setInterval(() => {
            if (clignotementCount >= 5) {
                clearInterval(intervalID);
                this.setVisibilite(true);
            } else {
                this.setVisibilite(!this.estVisible());
            }
            clignotementCount++;
        }, 200);
    }

  }

PersonnageRouge.ETAT = {
  ATTENTE : 0,
  MOUVEMENT_A_DROITE : 1,
  MOUVEMENT_A_GAUCHE : 2,
  MOUVEMENT_EN_SAUT : 3

}
PersonnageRouge.DEMANDE = {
  ATTENDRE : 0,
  ALLER_A_DROITE : 1,
  ALLER_A_GAUCHE : 2,
  SAUTER : 3

}
PersonnageRouge.VITESSE_PIXEL_SECONDE = 500;
PersonnageRouge.DUREE_SAUT = 2000;



