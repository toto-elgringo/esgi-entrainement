#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn connexion_neuve() {
        let connexion = Connexion::nouvelle("serveur:80");
        assert_eq!(connexion.adresse(), "serveur:80", "adresse gardée");
        assert_eq!(connexion.nombre_envoyes(), 0, "aucun message au départ");
    }

    #[test]
    fn envoi_compte_les_messages() {
        let mut connexion = Connexion::nouvelle("serveur:80").ouvrir();
        assert_eq!(connexion.envoyer("a"), 1, "premier message");
        assert_eq!(connexion.envoyer("b"), 2, "deuxième message");
        assert_eq!(connexion.nombre_envoyes(), 2, "compteur de l'état ouvert");
        assert_eq!(connexion.adresse(), "serveur:80", "adresse gardée à l'ouverture");
    }

    #[test]
    fn fermeture_garde_l_historique() {
        let mut connexion = Connexion::nouvelle("hote:1").ouvrir();
        connexion.envoyer("x");
        let fermee = connexion.fermer();
        assert_eq!(fermee.nombre_envoyes(), 1, "le message envoyé reste compté");
        let mut rouverte = fermee.ouvrir();
        assert_eq!(rouverte.envoyer("y"), 2, "on continue à compter après réouverture");
        assert_eq!(rouverte.adresse(), "hote:1", "adresse inchangée");
    }
}
