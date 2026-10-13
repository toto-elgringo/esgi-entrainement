#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn nouveau_robot() {
        let attendu = Robot {
            position: (0, 0),
            texte: String::new(),
            couleur: (0, 0, 0),
            actif: true,
        };
        assert_eq!(Robot::new(), attendu, "un nouveau robot est en (0, 0), sans texte, noir et actif");
    }

    #[test]
    fn avancer() {
        let mut robot = Robot::new();
        robot.traiter(Message::Avancer { x: 2, y: 3 });
        robot.traiter(Message::Avancer { x: 1, y: -4 });
        assert_eq!(robot.position, (3, -1), "(0, 0) + (2, 3) + (1, -4) = (3, -1)");
    }

    #[test]
    fn ecrire() {
        let mut robot = Robot::new();
        robot.traiter(Message::Ecrire(String::from("Bon")));
        robot.traiter(Message::Ecrire(String::from("jour")));
        assert_eq!(robot.texte, "Bonjour", "les textes s'ajoutent à la suite");
    }

    #[test]
    fn changer_couleur() {
        let mut robot = Robot::new();
        robot.traiter(Message::ChangerCouleur(255, 128, 0));
        assert_eq!(robot.couleur, (255, 128, 0), "la couleur doit être remplacée");
    }

    #[test]
    fn arret() {
        let mut robot = Robot::new();
        robot.traiter(Message::Avancer { x: 1, y: 1 });
        robot.traiter(Message::Arreter);
        robot.traiter(Message::Avancer { x: 5, y: 5 });
        robot.traiter(Message::Ecrire(String::from("Bip")));
        assert!(!robot.actif, "le robot doit être arrêté");
        assert_eq!(robot.position, (1, 1), "un robot arrêté ne bouge plus");
        assert_eq!(robot.texte, "", "un robot arrêté n'écrit plus");
    }
}
