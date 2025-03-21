 class App{
    constructor(){

        let dessin = document.getElementById("dessin");

        this.score = 0;
        this.scoreElement = document.getElementById("score")

        this.scene = new createjs.Stage(dessin);
        this.scene.largeur = dessin.scrollWidth;
        this.scene.hauteur = dessin.scrollHeight;
        this.estCharge = false;
        this.multiNode = new MultiNode();
        this.multiNode.confirmerConnexion = () => this.confirmerConnexion();
        this.multiNode.confirmerAuthentification = (autresParticipants) => this.confirmerAuthentification(autresParticipants);
        this.multiNode.apprendreAuthentification = (pseudonyme) => this.apprendreAuthentification(pseudonyme);
        this.multiNode.recevoirVariable = (variable) => this.recevoirVariable(variable);
        this.listeJoueur = {};
        this.champPseudonyme = document.getElementById("champ-pseudonyme");

        this.formulaireAuthentification = document.getElementById("formulaire-authentification");
        this.formulaireAuthentification.addEventListener("submit", (evenementsubmit) => this.soumettreAuthentificationJoueur(evenementsubmit))

        this.boutonAuthentification = document.getElementById("bouton-authentification");
        this.formulaireJeu = document.getElementById("formulaire-jeu");
        this.formulaireJeu.addEventListener("submit", (evenementsubmit) => this.soumettreAuthentificationJoueur(evenementsubmit))
        this.formulaireJeu.style.display = "none";
        this.personnageBleu = new PersonnageBleu(this.scene);
        this.personnageRouge = new PersonnageRouge(this.scene);
        this.joueurActif = null;
        this.joueurAutre = null;
        this.pseudonymeActif = "";
        this.pseudonymeAutre ="";

    }

    confirmerConnexion(){
    console.log("Je suis connecté.");
    this.pseudonymeActif = this.champPseudonyme.value;
    this.multiNode.demanderAuthentification(this.pseudonymeActif);
  }

  confirmerAuthentification(autresParticipants){
    console.log("Je suis authentifié.");
    console.log("Les autres participants sont " + JSON.stringify(autresParticipants));
    this.formulaireAuthentification.querySelector("fieldset").disabled = true;
    this.ajouterJoueur(this.pseudonymeActif);

    if(autresParticipants.length > 0){
      this.pseudonymeAutre = autresParticipants[0];
     // this.personnage2 = this.pseudonymeJoueur;
      this.ajouterJoueur(autresParticipants[0]);
      this.joueurActif = this.personnageRouge;
      this.joueurAutre = this.personnageBleu;
      this.afficherPartie();
    }else{
      this.joueurActif = this.personnageBleu;
    }
  }

  apprendreAuthentification(pseudonyme){
    console.log("Nouvel ami " + pseudonyme);
    this.ajouterJoueur(pseudonyme);
    this.pseudonymeAutre = pseudonyme;
    this.joueurAutre = this.personnageRouge;
    this.afficherPartie();
  }

  afficherPartie(){

    this.livre = new Livre(this.scene);
    this.manette = new Manette(this.scene);
    this.arrierePlan = new ArrierePlan(this.scene);
    createjs.Ticker.addEventListener("tick", evenementtick => this.bouclerGestionTemps(evenementtick));
    createjs.Ticker.setFPS(5);
    this.formulaireJeu.style.display = "block";
  }



  ajouterJoueur(pseudonyme){
    console.log("ajouterJoueur : " + pseudonyme);
    this.listeJoueur[pseudonyme] = {score : 0};
    console.log("score " + pseudonyme + " " + this.listeJoueur[pseudonyme].score);

  }

  soumettreAuthentificationJoueur(evenementsubmit){
    console.log("soumettreAuthentificationJoueur");
    evenementsubmit.preventDefault();
    this.multiNode.connecter();
    this.boutonAuthentification.disabled = true;

  }

  appliquerMouvement(pseudonyme, touche, etatTouche){
    if(pseudonyme == this.pseudonymeActif){

      if(etatTouche == "PRESSER"){
        switch(touche){
          case App.TOUCHE.DROITE:
          this.joueurActif.traiter(PersonnageBleu.DEMANDE.ALLER_A_DROITE);
          break;
          case App.TOUCHE.GAUCHE:
          this.joueurActif.traiter(PersonnageBleu.DEMANDE.ALLER_A_GAUCHE);
          break;
          case App.TOUCHE.GAUCHE:
          this.joueurActif.traiter(PersonnageBleu.DEMANDE.ALLER_A_GAUCHE);
          break;
          case App.TOUCHE.HAUT:
          this.joueurActif.traiter(PersonnageBleu.DEMANDE.SAUTER);
          break;
        }

      }else{

        switch(touche){
          case App.TOUCHE.DROITE:
          this.joueurActif.traiter(PersonnageBleu.DEMANDE.ATTENDRE);

          this.arrierePlan.traiter(ArrierePlan.DEMANDE.ATTENDRE);
          break;
          case App.TOUCHE.GAUCHE:
          this.joueurActif.traiter(PersonnageBleu.DEMANDE.ATTENDRE);
          break;
          case App.TOUCHE.HAUT:
          //this.personnage.traiter(Personnage.DEMANDE.ATTENDRE);
          break;
      }
      }

    }
      else{
        if(etatTouche == "PRESSER"){
          switch(touche){
            case App.TOUCHE.DROITE:
            this.joueurAutre.traiter(PersonnageBleu.DEMANDE.ALLER_A_DROITE);
            break;
            case App.TOUCHE.GAUCHE:
            this.joueurAutre.traiter(PersonnageBleu.DEMANDE.ALLER_A_GAUCHE);
            break;
            case App.TOUCHE.GAUCHE:
            this.joueurAutre.traiter(PersonnageBleu.DEMANDE.ALLER_A_GAUCHE);
            break;
            case App.TOUCHE.HAUT:
            this.joueurAutre.traiter(PersonnageBleu.DEMANDE.SAUTER);
            break;
            }
      }else{
        switch(touche){
            case App.TOUCHE.DROITE:
            this.joueurAutre.traiter(PersonnageBleu.DEMANDE.ATTENDRE);

            this.arrierePlan.traiter(ArrierePlan.DEMANDE.ATTENDRE);
            break;
            case App.TOUCHE.GAUCHE:
            this.joueurAutre.traiter(PersonnageBleu.DEMANDE.ATTENDRE);
            break;
            case App.TOUCHE.HAUT:
            //this.joueurAutre.traiter(Personnage.DEMANDE.ATTENDRE);
            break;

      }
    }

  }

  }

  recevoirVariable(variable){
    console.log("Surcharge de recevoirVariable " + variable.cle + " = " + variable.valeur);
    let message = JSON.parse(variable.valeur);
    if(message.pseudonyme == this.pseudonymeActif){
      switch (variable.cle) {
        case App.MESSAGE.POINT_DU_PERSONNAGE:
          this.verifierPointduJoueur(message.valeur);
        break;
       case App.MESSAGE.COLLISIONMANETTE:
          this.appliquerCollisionManette(message.pseudonyme);
        break;
        case App.MESSAGE.COLLISIONLIVRE:
          this.appliquerCollisionLivre(message.pseudonyme);
        break;
       case App.MESSAGE.SCOREDIMINU:
         this.compterScoreManette(message.pseudonyme, message.valeur);
          break;
          case App.MESSAGE.SCOREAUGMENTER:
         this.compterScoreLivre(message.pseudonyme, message.valeur);
         break;

       case App.MESSAGE.MOUVEMENT:
         this.appliquerMouvement(message.pseudonyme, message.touche, message.etatTouche);
         break;


        /*case App.MESSAGE.JOUEUR:
          this.subirCollision(message.pseudonyme, message.valeur);
        break;*/
        case App.MESSAGE.ETAT_ACTUEL:
          this.changerEtatJoueur(message.pseudonyme, message.valeur);
        break;
      }
    }else{
      switch (variable.cle) {
          case App.MESSAGE.POINT_DU_PERSONNAGE:
          this.verifierPointduAutreJoueur(message.valeur);
        break;
        case App.MESSAGE.COLLISIONMANETTE:
          this.appliquerCollisionManette(message.pseudonyme);
        break;
        case App.MESSAGE.COLLISIONLIVRE:
          this.appliquerCollisionLivre(message.pseudonyme);
        break;
        case App.MESSAGE.MOUVEMENT:
         this.appliquerMouvement(message.pseudonyme, message.touche, message.etatTouche);
         break;
      }
    }
  }

  subirCollisionManette(pseudonyme){
    console.log("subirCollision()=>valeur" );
    let message = {
      pseudonyme : pseudonyme

    };
   this.multiNode.posterVariableTextuelle(App.MESSAGE.COLLISIONMANETTE, JSON.stringify(message));

  }

  verifierFinPartie(pseudonyme, valeur){
    console.log("verifierFinPartie()=>valeur" );
    let message = {
      pseudonyme : pseudonyme,
      valeur : valeur

    };
   this.multiNode.posterVariableTextuelle(App.MESSAGE.POINT_DU_PERSONNAGE, JSON.stringify(message));

  }
  subirCollisionLivre(pseudonyme){
    console.log("subirCollision()=>valeur" );
    let message = {
      pseudonyme : pseudonyme

    };
   this.multiNode.posterVariableTextuelle(App.MESSAGE.COLLISIONLIVRE, JSON.stringify(message));

  }

  changerEtatJoueur(pseudonyme){
    let message = {
      pseudonyme : pseudonyme,
      etat : this.listeJoueur[pseudonyme].etat
    };
   this.multiNode.posterVariableTextuelle(App.MESSAGE.ETAT_ACTUEL, JSON.stringify(message));
  }

  bouclerGestionTemps(evenementtick){


    if(!this.estCharge && this.personnageBleu.estCharge && this.personnageRouge.estCharge && this.livre.estCharge && this.manette.estCharge && this.arrierePlan.estCharge) {

      this.estCharge = true;
      this.arrierePlan.afficher();
      this.personnageBleu.afficher();
      this.personnageRouge.afficher();
      this.livre.afficher();
      this.manette.afficher();
             window.addEventListener("keydown", evenementkeydown => this.gererTouchePressee(evenementkeydown));
             window.addEventListener("keyup", evenementkeyup => this.gererToucheLevee(evenementkeyup));
        }
        if(this.estCharge){

          let secondeEcoulee = evenementtick.delta/1000;
          this.arrierePlan.animer(secondeEcoulee);
          this.livre.animer(secondeEcoulee);
          this.manette.animer(secondeEcoulee);
          this.personnageBleu.animer(secondeEcoulee);
          this.personnageRouge.animer(secondeEcoulee);
          this.validerFinPartie();

          if(this.livre.estVisible() && this.testerCollisionRectangle(this.joueurActif.determinerRectangleOccupe(), this.livre.determinerRectangleOccupe()))
            {
              console.log("Collision entre le personnage et le livre!");
              this.subirCollisionLivre(this.pseudonymeActif);
              let message = {
              pseudonyme : this.pseudonymeActif,
              valeur : 1
                };
              this.multiNode.posterVariableTextuelle(App.MESSAGE.SCOREAUGMENTER, JSON.stringify(message));
            }

          if(this.manette.estVisible() && this.testerCollisionRectangle(this.joueurActif.determinerRectangleOccupe(), this.manette.determinerRectangleOccupe()))
            {
              this.subirCollisionManette(this.pseudonymeActif);
              let message = {
              pseudonyme : this.pseudonymeActif,
              valeur : -1
                };
                 //this.multiNode.posterVariableTextuelle(App.MESSAGE JSON.stringify(message));
              this.multiNode.posterVariableTextuelle(App.MESSAGE.SCOREDIMINU, JSON.stringify(message));
            }
        }
        this.scene.update(evenementtick);
    }

    compterScoreLivre(pseudonyme, valeur){
      this.score += valeur;
      this.scoreElement.textContent = this.score;
      console.log("Score: "+ this.score);
      this.verifierFinPartie(pseudonyme, this.score);
    }

    compterScoreManette(pseudonyme, valeur){
        this.score += valeur;
        this.scoreElement.textContent = this.score;
        console.log("Score: "+ this.score);
    }

    appliquerCollisionManette(pseudonyme){
      this.manette.setVisibilite(false);
      console.log("Collision entre le personnage et la manette!");

      if(pseudonyme == this.pseudonymeActif){
        this.joueurActif.clignoter();
        console.log("joueurActif clignoter");
      }else{
        this.joueurAutre.clignoter();
        console.log("joueurAutre clignoter");
      }
      this.manette.faireApparaitreNouvelleManette();
      }

     appliquerCollisionLivre(pseudonyme){
      this.livre.setVisibilite(false);
      console.log("Collision entre le personnage et le livre!");

      if(pseudonyme == this.pseudonymeActif){
        this.joueurActif.clignoter();
        console.log("joueurActif clignoter");
      }else{
        this.joueurAutre.clignoter();
        console.log("joueurAutre clignoter");
      }
     }

    testerCollisionRectangle(rectangleA, rectangleB){
    if(rectangleA.x >= rectangleB.x + rectangleB.largeur ||rectangleA.x + rectangleA.largeur <= rectangleB.x ||
       rectangleA.y >= rectangleB.y + rectangleB.hauteur ||rectangleA.y + rectangleA.hauteur <= rectangleB.y){
      return false;
    }
    return true;
  }

  gererTouchePressee(evenementkeydown){
    console.log("gererTouchePressee : "+evenementkeydown.keyCode);
    let message =null;
    switch(evenementkeydown.keyCode){

      case App.TOUCHE.DROITE:
         message = {
          pseudonyme : this.pseudonymeActif,
          touche : App.TOUCHE.DROITE,
          etatTouche : "PRESSER"
      };
      this.multiNode.posterVariableTextuelle(App.MESSAGE.MOUVEMENT, JSON.stringify(message));
      break;
      case App.TOUCHE.GAUCHE:
       message = {
          pseudonyme : this.pseudonymeActif,
          touche : App.TOUCHE.GAUCHE,
          etatTouche : "PRESSER"
      };

      this.multiNode.posterVariableTextuelle(App.MESSAGE.MOUVEMENT, JSON.stringify(message));
      break;
      case App.TOUCHE.HAUT:
        message = {
          pseudonyme : this.pseudonymeActif,
          touche : App.TOUCHE.HAUT,
          etatTouche : "PRESSER"
      };
      this.multiNode.posterVariableTextuelle(App.MESSAGE.MOUVEMENT, JSON.stringify(message));
      break;
    }
  }

  gererToucheLevee(evenementkeyup){
    console.log("gererToucheLevee : "+evenementkeyup.keyCode);
    let message =null;
    switch(evenementkeyup.keyCode){

      case App.TOUCHE.DROITE:
         message = {
          pseudonyme : this.pseudonymeActif,
          touche : App.TOUCHE.DROIT,
          etatTouche : "LEVER"
        };
      this.multiNode.posterVariableTextuelle(App.MESSAGE.MOUVEMENT, JSON.stringify(message));
      break;
      case App.TOUCHE.GAUCHE:
         message = {
          pseudonyme : this.pseudonymeActif,
          touche : App.TOUCHE.GAUCHE,
          etatTouche : "LEVER"
        };

      this.multiNode.posterVariableTextuelle(App.MESSAGE.MOUVEMENT, JSON.stringify(message));
      break;
      case App.TOUCHE.HAUT:
      break;

    }
  }

  verifierPointduJoueur(nouveauPointDuJoueur){
    console.log("verifierPointduJoueur()=>valeur" + nouveauPointDuJoueur);
    this.listeJoueur[this.pseudonymeActif].score = nouveauPointDuJoueur;
    this.validerFinPartie();
  }

  verifierPointduAutreJoueur(nouveauPointDuJoueur){
    console.log("verifierPointduAutreJoueur()=>valeur" + nouveauPointDuJoueur);
    this.listeJoueur[this.pseudonymeAutre].score = nouveauPointDuJoueur;
    this.validerFinPartie();
  }

  validerFinPartie(){
    if(this.listeJoueur[this.pseudonymeActif].score >= 1){
      console.log(this.listeJoueur[this.pseudonymeJoueur]);
      alert("Vous avez gagné!");
    }else if(this.listeJoueur[this.pseudonymeAutre].score >= 1){
      alert("Vous avez perdu!");
    }

  }
 }

 App.NOMBRE_JOUEUR_REQUIS = 2;
 App.MESSAGE = {
    JOUEUR : "JOUEUR",
    DETERMINER_JOUEUR: "DETERMINER_JOUEUR",
    POINT_DU_PERSONNAGE : "POINT_DU_PERSONNAGE",
    ETAT_ACTUEL : "ETAT_ACTUEL",
    COLLISIONMANETTE : "COLLISIONMANETTE",
    COLLISIONLIVRE : "COLLISIONLIVRE",
    MOUVEMENT : "MOUVEMENT",
    SCOREAUGMENTER : "SCOREAUGMENTER",
    SCOREDIMINU : "SCOREDIMINU"

};
 App.TOUCHE = {
  DROITE : 39,
  GAUCHE : 37,
  HAUT : 38

}

var app = new App();
