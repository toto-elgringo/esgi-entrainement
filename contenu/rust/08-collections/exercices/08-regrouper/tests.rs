#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fruits() {
        let groupes = regrouper_par_initiale(&["pomme", "poire", "banane", "cerise", "prune"]);
        assert_eq!(groupes.len(), 3, "trois initiales : p, b, c");
        assert_eq!(
            groupes.get(&'p'),
            Some(&vec!["pomme".to_string(), "poire".to_string(), "prune".to_string()]),
            "les mots en p, dans leur ordre d'arrivée"
        );
        assert_eq!(groupes.get(&'b'), Some(&vec!["banane".to_string()]), "un seul mot en b");
        assert_eq!(groupes.get(&'z'), None, "aucun mot en z");
    }

    #[test]
    fn mots_vides_ignores() {
        let groupes = regrouper_par_initiale(&["", "ane", ""]);
        assert_eq!(groupes.len(), 1, "les mots vides sont ignorés");
        assert_eq!(groupes.get(&'a'), Some(&vec!["ane".to_string()]), "seul « ane » est rangé");
    }

    #[test]
    fn liste_vide() {
        assert!(regrouper_par_initiale(&[]).is_empty(), "aucun mot : aucun groupe");
    }
}
