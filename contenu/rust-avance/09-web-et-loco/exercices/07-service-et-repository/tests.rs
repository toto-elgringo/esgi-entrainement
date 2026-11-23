#[cfg(test)]
mod tests {
    use super::*;

    struct Fixe;

    impl Mesures for Fixe {
        fn existe(&self, capteur: u32) -> bool {
            capteur == 7
        }

        fn valeurs_de(&self, _capteur: u32) -> Vec<f64> {
            vec![10.0, 20.0]
        }

        fn inserer(&mut self, _capteur: u32, _valeurs: &[f64]) -> usize {
            0
        }
    }

    #[test]
    fn existe_et_valeurs() {
        let repo = EnMemoire::avec_capteurs(&[1]);
        assert!(repo.existe(1), "le capteur 1 est connu");
        assert!(!repo.existe(2), "le capteur 2 est inconnu");
        assert_eq!(repo.valeurs_de(2), Vec::<f64>::new(), "un capteur inconnu n'a aucune valeur");
    }

    #[test]
    fn inserer_ajoute_a_la_fin() {
        let mut repo = EnMemoire::avec_capteurs(&[1]);
        assert_eq!(repo.inserer(1, &[1.0, 2.0]), 2, "deux valeurs ajoutées");
        assert_eq!(repo.inserer(1, &[3.0]), 1, "une valeur ajoutée");
        assert_eq!(repo.valeurs_de(1), vec![1.0, 2.0, 3.0], "les valeurs sont ajoutées à la fin");
    }

    #[test]
    fn inserer_capteur_inconnu() {
        let mut repo = EnMemoire::avec_capteurs(&[1]);
        assert_eq!(repo.inserer(5, &[1.0]), 0, "rien n'est ajouté à un capteur inconnu");
        assert!(!repo.existe(5), "le capteur inconnu n'est pas créé");
    }

    #[test]
    fn stats_avec_mesures() {
        let mut repo = EnMemoire::avec_capteurs(&[1, 2]);
        repo.inserer(1, &[21.0, 22.0, 20.0]);
        assert_eq!(
            stats_capteur(&repo, 1),
            Some(StatsCapteur { capteur: 1, nb_mesures: 3, moyenne: Some(21.0) }),
            "trois mesures, moyenne 21"
        );
    }

    #[test]
    fn stats_sans_mesure() {
        let repo = EnMemoire::avec_capteurs(&[2]);
        assert_eq!(
            stats_capteur(&repo, 2),
            Some(StatsCapteur { capteur: 2, nb_mesures: 0, moyenne: None }),
            "un capteur sans mesure n'a pas de moyenne"
        );
    }

    #[test]
    fn stats_capteur_inconnu() {
        let repo = EnMemoire::avec_capteurs(&[1]);
        assert_eq!(stats_capteur(&repo, 9), None, "un capteur inconnu donne None");
    }

    #[test]
    fn service_generique() {
        assert_eq!(
            stats_capteur(&Fixe, 7),
            Some(StatsCapteur { capteur: 7, nb_mesures: 2, moyenne: Some(15.0) }),
            "le service marche avec un autre repository"
        );
        assert_eq!(stats_capteur(&Fixe, 1), None, "l'autre repository dit que 1 n'existe pas");
    }
}
