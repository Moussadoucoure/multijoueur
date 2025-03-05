 class Manette{

     constructor(scene){

         this.scene = scene;
         this.estCharge = false;
         this.image = new Image();
         this.image.addEventListener("load", evenementload => this.creerSprite(evenementload));
         this.image.src = "illustration/manette1.png";
         this.tempsInvisible = 0;
         this.tempsLimiteInvisible = 2000;
         this.estVisiblePrecedemment = false;

    }

    creerSprite(evenementload){
        console.log("Image manette.png chargee");

        let spriteSheetManette = new createjs.SpriteSheet({
            images: [this.image],

            frames:{
            width: 97.25,
            height:130
            },

            animations:{
            manette:[0,1]

            }
        });

         this.spriteManette = new createjs.Sprite(spriteSheetManette, "manette");

         this.spriteManette.setBounds(
            this.spriteManette.x,
            this.spriteManette.y,
            97.25 ,
            130 );
        this.estCharge = true;
        console.log("spriteManette cree");

    }

    positionAleatoire() {

      if (this.spriteManette) {
        this.spriteManette.x = Math.floor(Math.random() * (this.scene.largeur - this.image.width));
        this.spriteManette.y = Math.floor(Math.random() * (this.scene.hauteur - this.image.height));
      } else {
        console.error("Le spriteManette n'est pas défini.");
      }
    }

    afficher(){
      this.spriteManette.x = 1900;
      this.spriteManette.y = 675;
      //this.positionAleatoire();
      console.log("sprite manette ajoutee a la scene");
      this.scene.addChild(this.spriteManette);
    }

    estVisible(){
      return this.spriteManette.isVisible();
    }
    setVisibilite(visible){
      this.spriteManette.visible = visible;
    }

    determinerRectangleOccupe(){
    return {
      x: this.spriteManette.x,
      y: this.spriteManette.y,
      largeur: 97.25,
      hauteur: 130
    };
  }

  animer(secondeEcoulee){
    this.spriteManette.x -= Manette.VITESSE_PIXEL_SECONDE * secondeEcoulee;

     if (!this.estVisible()) {
            this.tempsInvisible += secondeEcoulee;
            if (this.tempsInvisible >= this.tempsLimiteInvisible) {
                // Si la manette est invisible depuis plus de 3 secondes, réinitialisez le temps et faites apparaître une nouvelle manette
                this.tempsInvisible = 0;

            }
        } else {
            this.tempsInvisible = 0;
        }
  }

  faireApparaitreNouvelleManette() {

        this.setVisibilite(true);
        this.spriteManette.x = 1900;
        this.spriteManette.y = 675;
        //nouvelleManette.afficher();
    }

}

Manette.VITESSE_PIXEL_SECONDE = 40;

