class PersonnageBleu {
    constructor(scene) {
        this.scene = scene;
        this.estCharge = false;
        this.image = new Image();
        this.image.addEventListener("load", evenementload => this.creerSprite(evenementload));
        this.image.src = "illustration/joueur1.png";
        this.debutSaut = 0;
        this.etat = PersonnageBleu.ETAT.ATTENTE;
        this.vitesseSaut = 2000;  // Vitesse de saut ajustable
        this.vitesseDeplacement = PersonnageBleu.VITESSE_PIXEL_SECONDE;  // Vitesse de déplacement
    }

    // Crée le sprite du personnage à partir de l'image
    creerSprite(evenementload) {
        console.log("Image personnage.png chargée");

        const spriteSheetPersonnage = new createjs.SpriteSheet({
            images: [this.image],
            frames: { width: 133.16, height: 170 },
            animations: {
                marcher: [0, 4],
                pause: [0]
            }
        });
        console.log("SpriteSheetPersonnage créé");

        this.spritePersonnage = new createjs.Container();
        this.spritePersonnagePause = new createjs.Sprite(spriteSheetPersonnage, "pause");
        this.spritePersonnagemarche = new createjs.Sprite(spriteSheetPersonnage, "marcher");
        this.spritePersonnagemarche.visible = false;

        this.spritePersonnage.addChild(this.spritePersonnagePause);
        this.spritePersonnage.addChild(this.spritePersonnagemarche);

        this.spritePersonnage.setBounds(this.spritePersonnage.x, this.spritePersonnage.y, 133.16, 170);
        this.estCharge = true;
        console.log("spritePersonnage créé");
    }

    // Ajoute le personnage à la scène
    afficher() {
        this.spritePersonnage.x = 220;
        this.spritePersonnage.y = 630;
        this.spritePersonnage.name = "personnage";
        this.scene.addChild(this.spritePersonnage);
        console.log("spritePersonnage ajouté à la scène");
    }

    // Limite les mouvements du personnage dans la scène
    limiterMouvement(testX, testY) {
        let nouveauX = Math.max(0, Math.min(testX, this.scene.largeur - this.spritePersonnage.getBounds().width));
        let nouveauY = Math.max(0, Math.min(testY, 800 - this.spritePersonnage.getBounds().height));
        console.log("limiterMouvement {x: nouveauX}", { x: nouveauX });
        return { x: nouveauX, y: nouveauY };
    }

    // Gère l'avancée du personnage à droite
    avancer(secondeEcoulee) {
        this.spritePersonnage.x = this.limiterMouvement(this.spritePersonnage.x + this.vitesseDeplacement * secondeEcoulee, this.spritePersonnage.y).x;
    }

    // Gère le recul du personnage à gauche
    reculer(secondeEcoulee) {
        this.spritePersonnage.x = this.limiterMouvement(this.spritePersonnage.x - this.vitesseDeplacement * secondeEcoulee, this.spritePersonnage.y).x;
    }

    // Déplace le personnage vers le haut (saut)
    monter(secondeEcoulee) {
        this.spritePersonnage.y = this.limiterMouvement(this.spritePersonnage.x, this.spritePersonnage.y - this.vitesseDeplacement * secondeEcoulee).y;
    }

    // Déplace le personnage vers le bas (descente du saut)
    descendre(secondeEcoulee) {
        this.spritePersonnage.y = this.limiterMouvement(this.spritePersonnage.x, this.spritePersonnage.y + this.vitesseDeplacement * secondeEcoulee).y;
    }

    // Gère le saut du personnage
    sauter(secondeEcoulee) {
        if (!this.debutSaut) {
            this.debutSaut = Date.now();
        }
        let tempsActuel = Date.now();
        if (tempsActuel - this.debutSaut < this.vitesseSaut / 2) {
            this.monter(secondeEcoulee);
        } else {
            this.descendre(secondeEcoulee);
        }

        if (tempsActuel - this.debutSaut >= this.vitesseSaut) {
            this.debutSaut = 0;
            this.etat = PersonnageBleu.ETAT.ATTENTE;
        }
    }

    // Gère les demandes de mouvement
    traiter(demande) {
        if (this.etat !== PersonnageBleu.ETAT.MOUVEMENT_EN_SAUT) {
            switch (demande) {
                case PersonnageBleu.DEMANDE.ATTENDRE:
                    this.etat = PersonnageBleu.ETAT.ATTENTE;
                    break;
                case PersonnageBleu.DEMANDE.ALLER_A_DROITE:
                    this.etat = PersonnageBleu.ETAT.MOUVEMENT_A_DROITE;
                    break;
                case PersonnageBleu.DEMANDE.ALLER_A_GAUCHE:
                    this.etat = PersonnageBleu.ETAT.MOUVEMENT_A_GAUCHE;
                    break;
                case PersonnageBleu.DEMANDE.SAUTER:
                    this.etat = PersonnageBleu.ETAT.MOUVEMENT_EN_SAUT;
                    break;
            }
        }
    }

    // Anime le personnage en fonction de l'état actuel
    animer(secondeEcoulee) {
        switch (this.etat) {
            case PersonnageBleu.ETAT.ATTENTE:
                this.spritePersonnagemarche.visible = false;
                this.spritePersonnagePause.visible = true;
                break;
            case PersonnageBleu.ETAT.MOUVEMENT_A_DROITE:
                this.avancer(secondeEcoulee);
                this.spritePersonnagemarche.visible = true;
                this.spritePersonnagePause.visible = false;
                break;
            case PersonnageBleu.ETAT.MOUVEMENT_A_GAUCHE:
                this.reculer(secondeEcoulee);
                break;
            case PersonnageBleu.ETAT.MOUVEMENT_EN_SAUT:
                this.sauter(secondeEcoulee);
                break;
        }
    }

    // Retourne le rectangle occupé par le personnage
    determinerRectangleOccupe() {
        return {
            x: this.spritePersonnage.x,
            y: this.spritePersonnage.y,
            largeur: this.spritePersonnage.getBounds().width,
            hauteur: this.spritePersonnage.getBounds().height
        };
    }

    // Vérifie si le personnage est visible
    estVisible() {
        return this.spritePersonnage.isVisible();
    }

    // Définit la visibilité du personnage
    setVisibilite(visible) {
        this.spritePersonnage.visible = visible;
    }

    // Fait clignoter le personnage
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

// Définition des états et demandes
PersonnageBleu.ETAT = {
    ATTENTE: 0,
    MOUVEMENT_A_DROITE: 1,
    MOUVEMENT_A_GAUCHE: 2,
    MOUVEMENT_EN_SAUT: 3
};

PersonnageBleu.DEMANDE = {
    ATTENDRE: 0,
    ALLER_A_DROITE: 1,
    ALLER_A_GAUCHE: 2,
    SAUTER: 3
};

PersonnageBleu.VITESSE_PIXEL_SECONDE = 500;
PersonnageBleu.DUREE_SAUT = 2000;
