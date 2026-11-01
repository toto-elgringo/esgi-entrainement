#[cfg(test)]
mod tests {
    use super::*;

    fn totaux(paires: &[(&str, u32)]) -> BTreeMap<String, u32> {
        paires.iter().map(|&(nom, total)| (nom.to_string(), total)).collect()
    }

    fn classement(paires: &[(&str, u32)]) -> Vec<(String, u32)> {
        paires.iter().map(|&(nom, total)| (nom.to_string(), total)).collect()
    }

    #[test]
    fn totaliser_avec_une_cle() {
        assert_eq!(
            totaliser_par(&exemple(), |_| "tout".to_string()),
            totaux(&[("tout", 239)]),
            "une seule clé pour tous les achats : le total général, 239"
        );
        assert_eq!(
            totaliser_par(&exemple(), |achat| if achat.montant >= 30 { "gros" } else { "petit" }.to_string()),
            totaux(&[("gros", 175), ("petit", 64)]),
            "60 + 30 + 40 + 45 = 175 pour les gros achats, 25 + 12 + 18 + 9 = 64 pour les petits"
        );
        assert!(totaliser_par(&[], |achat| achat.client.clone()).is_empty(), "aucun achat : aucun total");
    }

    #[test]
    fn totaux_par_client_et_par_categorie() {
        assert_eq!(
            total_par_client(&exemple()),
            totaux(&[("Ana", 77), ("Léo", 69), ("Mia", 48), ("Zoé", 45)]),
            "Ana : 25 + 12 + 40 = 77, Léo : 60 + 9 = 69, Mia : 18 + 30 = 48, Zoé : 45"
        );
        assert_eq!(
            total_par_categorie(&exemple()),
            totaux(&[("jeux", 145), ("livres", 52), ("musique", 42)]),
            "jeux : 60 + 45 + 40 = 145, livres : 25 + 18 + 9 = 52, musique : 12 + 30 = 42"
        );
    }

    #[test]
    fn classement_des_clients() {
        assert_eq!(
            meilleurs_clients(&exemple(), 2),
            classement(&[("Ana", 77), ("Léo", 69)]),
            "les deux plus gros clients, du plus grand au plus petit"
        );
        assert_eq!(
            meilleurs_clients(&exemple(), 10),
            classement(&[("Ana", 77), ("Léo", 69), ("Mia", 48), ("Zoé", 45)]),
            "n plus grand que le nombre de clients : tous les clients"
        );
        assert!(meilleurs_clients(&exemple(), 0).is_empty(), "n = 0 : liste vide");
        let egalite = [achat("Zoé", "jeux", 10), achat("Bob", "livres", 10), achat("Ana", "jeux", 5)];
        assert_eq!(
            meilleurs_clients(&egalite, 2),
            classement(&[("Bob", 10), ("Zoé", 10)]),
            "Bob et Zoé ont 10 € chacun : ordre alphabétique"
        );
    }

    #[test]
    fn la_categorie_phare() {
        assert_eq!(categorie_phare(&exemple()), Some("jeux".to_string()), "les jeux rapportent 145 €");
        let egalite = [achat("Ana", "sport", 10), achat("Léo", "cuisine", 10)];
        assert_eq!(
            categorie_phare(&egalite),
            Some("cuisine".to_string()),
            "égalité à 10 € : « cuisine » vient avant « sport »"
        );
        assert_eq!(categorie_phare(&[]), None, "aucun achat : None");
    }

    #[test]
    fn remise() {
        let achats = exemple();
        let remises = avec_remise(&achats, "jeux", 50);
        let montants: Vec<u32> = remises.iter().map(|achat| achat.montant).collect();
        assert_eq!(
            montants,
            vec![25, 30, 12, 18, 9, 22, 30, 20],
            "les jeux coûtent moitié prix (45 devient 22), le reste ne change pas"
        );
        assert_eq!(remises[1], achat("Léo", "jeux", 30), "le client et la catégorie sont conservés");
        assert_eq!(achats, exemple(), "la liste de départ n'a pas changé");
    }

    #[test]
    fn fonctions_composees() {
        let achats = exemple();
        assert_eq!(
            categorie_phare(&avec_remise(&achats, "jeux", 100)),
            Some("livres".to_string()),
            "si les jeux sont gratuits, les livres (52 €) passent devant"
        );
        assert_eq!(
            meilleurs_clients(&avec_remise(&achats, "jeux", 100), 1),
            classement(&[("Mia", 48)]),
            "sans les jeux : Ana 37, Léo 9, Mia 48, Zoé 0"
        );
    }
}
