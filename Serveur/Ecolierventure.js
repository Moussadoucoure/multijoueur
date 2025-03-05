const MultiNodeServeur = require('./MultiNodeServeur.js');

class Variable{
  static type = "texte";
  static cle = null;
  static valeur = null;

  static formaterPourMessage(){
    return {
      type : this.type,
      cle : this.cle,
      valeur : this.valeur
    }
  }
}

class VariablePointDeVie extends Variable {
  static cle = "POINT_DE_VIE";

  static setValeur(pseudonyme, valeur){
    let valeurObjet = { pseudonyme : pseudonyme, valeur : valeur };
    this.valeur = JSON.stringify(valeurObjet);
  }
}

class VariableFinPartie extends Variable {
  static cle = "FIN_PARTIE";

  static setValeur(pseudonymeJoueurPerdant){
    let valeurObjet = { pseudonyme : pseudonymeJoueurPerdant, valeur : true };
    this.valeur = JSON.stringify(valeurObjet);
  }
}


class Personnage extends MultiNodeServeur.Joueur{
  constructor(pseudonyme, pointDeVie){
    super(pseudonyme);
    this.pointDeVie = pointDeVie;
  }
}


class Ecolierventure{
  constructor(){
    this.multiNodeServeur = new MultiNodeServeur.Serveur();
    //Surcharge des méthode de MultiNodeServeur.js pour les besoins du jeu Attaque
    this.multiNodeServeur.actionReceptionMessageTransfertVariable = (messageTransfertVariable) => this.actionReceptionMessageTransfertVariable(messageTransfertVariable);
    this.multiNodeServeur.actionFinReceptionMessage = () => this.actionFinReceptionMessage();
    this.multiNodeServeur.actionCreerJoueur = (pseudonyme) => this.actionCreerJoueur(pseudonyme);
  }

  actionReceptionMessageTransfertVariable(messageTransfertVariable){
    //variableCle : "ATTAQUE" ou "FIN_PARTIE" ou "POINT_DE_VIE"
    let variableCle = messageTransfertVariable.variable.cle;

    //Le serveur transfère le message "messageTransfertVariable" par défaut.
    //Le message d'origine peut être transformé ou échanger par un nouveau message.
    //Le switch case permet de faire des actions pour chaque message reçu.
    this.multiNodeServeur.repondreTransfertVariable(messageTransfertVariable);
  }

  actionFinReceptionMessage(){
    console.log("Ecolierventure.actionFinReceptionMessage");
    //Identifier le joueur perdant
   /* let pseudonymeJoueurPerdant = this.identifierPseudonymeJoueurPerdant();
    //S'il existe
    if(pseudonymeJoueurPerdant){
      //Créer un nouveau message VariableFinPartie
      let messageTransfertVariable = this.multiNodeServeur.messageTransfertVariable;
      VariableFinPartie.setValeur(pseudonymeJoueurPerdant);
      messageTransfertVariable.variable = VariableFinPartie.formaterPourMessage();
      //Transférer le message à tous les clients
      this.multiNodeServeur.repondreTransfertVariable(messageTransfertVariable);
    }*/
  }

  actionCreerJoueur(pseudonyme){
    //Création d'un joueur spécifique pour le jeu Attaque ou autre
    return new Personnage (pseudonyme, 20);
  }

}

new Ecolierventure();


