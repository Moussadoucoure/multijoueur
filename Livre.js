 class Livre{
     constructor(scene){
         this.scene = scene;
         this.estCharge = false;
         this.image = new Image();
         this.image.addEventListener("load", evenementload => this.creerBitmap(evenementload));
         this.image.src = "illustration/livre.png";

    }

    creerBitmap(evenementload){
        console.log("Image livre.png debut chargement");
        this.bitmap = new createjs.Bitmap(this.image);
        this.estCharge = true;
        console.log("Image livre.png chargee");


        this.bitmap.setBounds(
            this.bitmap.x,
            this.bitmap.y,
            195 * 0.5,
            210 * 0.5 );
        this.estCharge = true;
        console.log("bitmapLivre cree");
    }

    afficher(){
        this.bitmap.x = 2500;
        this.bitmap.y = 637;
        //this.bitmap.name="livre";
        console.log("bitmap ajoutee a la scene");
        this.scene.addChild(this.bitmap);
    }

    estVisible(){
      return this.bitmap.isVisible();
    }
    setVisibilite(visible){
      this.bitmap.visible = visible;
    }

    determinerRectangleOccupe(){
    return {
      x: this.bitmap.x,
      y: this.bitmap.y,
      largeur: this.image.width,
      hauteur: this.image.height
    };
  }

  animer(secondeEcoulee){
    this.bitmap.x -= Livre.VITESSE_PIXEL_SECONDE * secondeEcoulee;
  }

}

Livre.VITESSE_PIXEL_SECONDE = 40;
