#[cfg(test)]
mod tests {
    use super::*;

    fn personne(nom: &str, age: u32) -> Personne {
        Personne {
            nom: nom.to_string(),
            age,
        }
    }

    #[test]
    fn age_extrait() {
        assert_eq!(extraire_age("Ana:20"), Some(20), "« Ana:20 » : 20 ans");
        assert_eq!(extraire_age("Ana: 20 "), Some(20), "les espaces autour de l'âge ne comptent pas");
        assert_eq!(extraire_age("Ana"), None, "pas de « : » : pas d'âge");
        assert_eq!(extraire_age("Ana:vingt"), None, "« vingt » n'est pas un nombre");
        assert_eq!(extraire_age("Ana:-3"), None, "un âge négatif n'est pas valide");
    }

    #[test]
    fn personne_valide() {
        assert_eq!(lire_personne("Ana:20"), Ok(personne("Ana", 20)), "« Ana:20 » donne Ana, 20 ans");
        assert_eq!(
            lire_personne("  Léo :  19 "),
            Ok(personne("Léo", 19)),
            "les espaces autour du nom et de l'âge sont enlevés"
        );
    }

    #[test]
    fn erreurs_de_lecture() {
        assert_eq!(lire_personne("Ana 20"), Err(ErreurLecture::SeparateurManquant), "pas de « : » dans « Ana 20 »");
        assert_eq!(lire_personne("  :19"), Err(ErreurLecture::NomVide), "le nom est vide");
        assert_eq!(lire_personne("Mia:vingt"), Err(ErreurLecture::AgeInvalide), "« vingt » n'est pas un âge");
        assert_eq!(lire_personne("Mia:"), Err(ErreurLecture::AgeInvalide), "l'âge est vide");
        assert_eq!(lire_personne(" :abc"), Err(ErreurLecture::NomVide), "le nom est vérifié avant l'âge");
    }

    #[test]
    fn toutes_les_lignes() {
        assert_eq!(
            lire_toutes(&["Ana:20", "Léo:19"]),
            Ok(vec![personne("Ana", 20), personne("Léo", 19)]),
            "deux lignes valides : deux personnes, dans l'ordre"
        );
        assert_eq!(
            lire_toutes(&["Ana:20", "Léo", "Mia:x"]),
            Err(ErreurLecture::SeparateurManquant),
            "la première erreur est le « : » qui manque sur la ligne de Léo"
        );
        assert_eq!(lire_toutes(&[]), Ok(vec![]), "aucune ligne : liste vide");
    }

    #[test]
    fn majeurs() {
        assert_eq!(
            noms_des_majeurs(&["Ana:20", "Léo:15", "???", "Mia:18"]),
            vec!["Ana", "Mia"],
            "Ana (20 ans) et Mia (18 ans) sont majeures ; Léo a 15 ans et « ??? » est ignoré"
        );
        assert!(noms_des_majeurs(&["Léo:17", "Mia"]).is_empty(), "aucun majeur");
    }
}
