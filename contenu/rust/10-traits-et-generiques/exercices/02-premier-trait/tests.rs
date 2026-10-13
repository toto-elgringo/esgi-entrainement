#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn voiture_methode_par_defaut() {
        let voiture = Voiture { marque: "Renault".to_string() };
        assert_eq!(voiture.presenter(), "Renault : 4 roues", "la voiture utilise la méthode par défaut");
    }

    #[test]
    fn velo_methodes() {
        assert_eq!(Velo.nom(), "Vélo", "le nom du vélo");
        assert_eq!(Velo.roues(), 2, "un vélo a 2 roues");
    }

    #[test]
    fn velo_methode_remplacee() {
        assert_eq!(Velo.presenter(), "Vélo : 2 roues, sans moteur", "le vélo remplace la méthode par défaut");
    }
}
