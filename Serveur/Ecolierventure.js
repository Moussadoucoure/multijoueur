const MultiNodeServeur = require('./MultiNodeServeur.js');

// Classe de base pour les variables
class Variable {
  static type = "texte";
  static cle = null;
  static valeur = null;

  static formaterPourMessage() {
    return {
      type: this.type,
      cle: this.cle,
      valeur: this.valeur,
    };
  }
}

// Variable représentant les points de vie
class VariablePointDeVie extends Variable {
  static cle = "POINT_DE_VIE";

  static setValeur(pseudonyme, valeur) {
    let valeurObjet = { pseudonyme: pseudonyme, valeur: valeur };
    this.valeur = JSON.stringify(valeurObjet);
  }
}

// Variable représentant la fin de la partie
class VariableFinPartie extends Variable {
  static cle = "FIN_PARTIE";

  static setValeur(pseudonymeJoueurPerdant) {
    let valeurObjet = { pseudonyme: pseudonymeJoueurPerdant, valeur: true };
    this.valeur = JSON.stringify(valeurObjet);
  }
}

// Personnage représentant un joueur dans le jeu
class Personnage extends MultiNodeServeur.Joueur {
  constructor(pseudonyme, pointDeVie) {
    super(pseudonyme);
    this.pointDeVie = pointDeVie;
  }

  // Méthode pour attaquer un autre joueur
  attaquer(joueurCible, dommage) {
    joueurCible.recevoirDommage(dommage);
  }

  // Méthode pour recevoir un dommage
  recevoirDommage(dommage) {
    this.pointDeVie -= dommage;
    if (this.pointDeVie <= 0) {
      this.pointDeVie = 0;
      console.log(`${this.pseudonyme} est éliminé !`);
    }
  }
}

// Classe principale de gestion du jeu
class Ecolierventure {
  constructor() {
    this.multiNodeServeur = new MultiNodeServeur.Serveur();
    this.joueurs = new Map();

    // Surcharge des méthodes de MultiNodeServeur.js pour les besoins du jeu
    this.multiNodeServeur.actionReceptionMessageTransfertVariable = (messageTransfertVariable) => this.actionReceptionMessageTransfertVariable(messageTransfertVariable);
    this.multiNodeServeur.actionFinReceptionMessage = () => this.actionFinReceptionMessage();
    this.multiNodeServeur.actionCreerJoueur = (pseudonyme) => this.actionCreerJoueur(pseudonyme);
  }

  // Réception et gestion des messages de transfert de variables
  actionReceptionMessageTransfertVariable(messageTransfertVariable) {
    let variableCle = messageTransfertVariable.variable.cle;
    console.log(`Message reçu : ${variableCle}`);

    switch (variableCle) {
      case "ATTAQUE":
        this.gestionAttaque(messageTransfertVariable);
        break;

      case "POINT_DE_VIE":
        this.gestionPointsDeVie(messageTransfertVariable);
        break;

      case "FIN_PARTIE":
        this.gestionFinPartie(messageTransfertVariable);
        break;

      default:
        this.multiNodeServeur.repondreTransfertVariable(messageTransfertVariable);
        break;
    }
  }

  // Gestion des attaques entre joueurs
  gestionAttaque(messageTransfertVariable) {
    const { pseudonymeAttaquant, pseudonymeCible, dommage } = JSON.parse(messageTransfertVariable.variable.valeur);

    const attaquant = this.joueurs.get(pseudonymeAttaquant);
    const cible = this.joueurs.get(pseudonymeCible);

    if (attaquant && cible) {
      attaquant.attaquer(cible, dommage);

      // Mise à jour des points de vie du joueur ciblé
      let messagePointDeVie = this.multiNodeServeur.messageTransfertVariable;
      VariablePointDeVie.setValeur(cible.pseudonyme, cible.pointDeVie);
      messagePointDeVie.variable = VariablePointDeVie.formaterPourMessage();
      this.multiNodeServeur.repondreTransfertVariable(messagePointDeVie);

      // Vérification de la fin de la partie si un joueur est éliminé
      if (cible.pointDeVie <= 0) {
        this.declencherFinPartie(cible.pseudonyme);
      }
    }
  }

  // Mise à jour des points de vie d'un joueur
  gestionPointsDeVie(messageTransfertVariable) {
    const { pseudonyme, valeur } = JSON.parse(messageTransfertVariable.variable.valeur);
    const joueur = this.joueurs.get(pseudonyme);
    if (joueur) {
      joueur.pointDeVie = valeur;
    }
  }

  // Gestion de la fin de la partie
  gestionFinPartie(messageTransfertVariable) {
    const { pseudonymeJoueurPerdant } = JSON.parse(messageTransfertVariable.variable.valeur);
    this.declencherFinPartie(pseudonymeJoueurPerdant);
  }

  // Déclenche la fin de la partie pour un joueur
  declencherFinPartie(pseudonymeJoueurPerdant) {
    let messageFinPartie = this.multiNodeServeur.messageTransfertVariable;
    VariableFinPartie.setValeur(pseudonymeJoueurPerdant);
    messageFinPartie.variable = VariableFinPartie.formaterPourMessage();
    this.multiNodeServeur.repondreTransfertVariable(messageFinPartie);

    // Afficher la fin de la partie
    console.log(`${pseudonymeJoueurPerdant} a perdu la partie !`);
  }

  // Création d'un joueur
  actionCreerJoueur(pseudonyme) {
    const joueur = new Personnage(pseudonyme, 20); // Chaque joueur commence avec 20 points de vie
    this.joueurs.set(pseudonyme, joueur);
    return joueur;
  }

  // Méthode pour détecter la fin du jeu
  actionFinReceptionMessage() {
    console.log("Fin de réception des messages");
    // Logique pour identifier la fin du jeu ici, par exemple, vérifier si un seul joueur reste
  }
}

new Ecolierventure();
