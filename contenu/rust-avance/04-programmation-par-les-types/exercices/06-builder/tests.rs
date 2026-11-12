#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valeurs_par_defaut() {
        let requete = RequeteBuilder::nouveau().url("https://a.fr").construire().unwrap();
        assert_eq!(
            requete,
            Requete {
                url: "https://a.fr".to_string(),
                methode: "GET".to_string(),
                delai: 30,
                en_tetes: vec![],
            },
            "méthode GET et délai 30 par défaut"
        );
    }

    #[test]
    fn tout_personnaliser() {
        let requete = RequeteBuilder::nouveau()
            .url("https://b.fr")
            .methode("POST")
            .delai(5)
            .en_tete("Accept", "json")
            .en_tete("Langue", "fr")
            .construire()
            .unwrap();
        assert_eq!(requete.methode, "POST", "méthode changée");
        assert_eq!(requete.delai, 5, "délai changé");
        assert_eq!(
            requete.en_tetes,
            vec![("Accept".to_string(), "json".to_string()), ("Langue".to_string(), "fr".to_string())],
            "en-têtes dans l'ordre"
        );
    }

    #[test]
    fn adresse_obligatoire() {
        assert_eq!(
            RequeteBuilder::nouveau().construire(),
            Err("l'adresse est obligatoire".to_string()),
            "sans adresse"
        );
    }

    #[test]
    fn delai_positif() {
        assert_eq!(
            RequeteBuilder::nouveau().url("https://c.fr").delai(0).construire(),
            Err("le délai doit être positif".to_string()),
            "délai nul"
        );
    }
}
