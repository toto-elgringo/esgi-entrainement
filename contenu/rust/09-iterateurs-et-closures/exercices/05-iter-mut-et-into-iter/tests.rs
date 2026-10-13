#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn augmentation() {
        let mut prix = vec![10, 20, 30];
        augmenter_tous(&mut prix, 5);
        assert_eq!(prix, vec![15, 25, 35], "chaque prix augmente de 5");
    }

    #[test]
    fn majuscules() {
        let mots = vec!["rust".to_string(), "Ok".to_string()];
        assert_eq!(en_majuscules(mots), vec!["RUST".to_string(), "OK".to_string()], "les mots en majuscules");
        assert_eq!(en_majuscules(vec![]), Vec::<String>::new(), "liste vide : résultat vide");
    }

    #[test]
    fn majeurs() {
        let personnes = vec![
            ("Léa".to_string(), 17),
            ("Tom".to_string(), 30),
            ("Ana".to_string(), 18),
        ];
        assert_eq!(
            noms_des_majeurs(personnes),
            vec!["Tom".to_string(), "Ana".to_string()],
            "Tom (30 ans) et Ana (18 ans) sont majeurs, pas Léa (17 ans)"
        );
    }
}
