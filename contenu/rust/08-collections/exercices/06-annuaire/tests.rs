#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    #[test]
    fn ajout_nouveau_contact() {
        let mut annuaire = HashMap::new();
        assert!(ajouter(&mut annuaire, "Alice", "06 11 22 33 44"), "Alice est nouvelle : true attendu");
        assert_eq!(annuaire.len(), 1, "l'annuaire contient 1 contact");
    }

    #[test]
    fn ajout_contact_existant() {
        let mut annuaire = HashMap::new();
        ajouter(&mut annuaire, "Alice", "06 11 22 33 44");
        assert!(!ajouter(&mut annuaire, "Alice", "07 00 00 00 00"), "Alice existait déjà : false attendu");
        assert_eq!(annuaire.len(), 1, "toujours 1 seul contact");
        assert_eq!(chercher(&annuaire, "Alice"), Some("07 00 00 00 00".to_string()), "le numéro d'Alice a été remplacé");
    }

    #[test]
    fn recherche() {
        let mut annuaire = HashMap::new();
        ajouter(&mut annuaire, "Bob", "01 02 03 04 05");
        assert_eq!(chercher(&annuaire, "Bob"), Some("01 02 03 04 05".to_string()), "le numéro de Bob");
        assert_eq!(chercher(&annuaire, "Zoé"), None, "Zoé n'est pas dans l'annuaire");
    }

    #[test]
    fn suppression() {
        let mut annuaire = HashMap::new();
        ajouter(&mut annuaire, "Bob", "01 02 03 04 05");
        assert!(supprimer(&mut annuaire, "Bob"), "Bob existait : true attendu");
        assert!(!supprimer(&mut annuaire, "Bob"), "Bob a déjà été supprimé : false attendu");
        assert_eq!(chercher(&annuaire, "Bob"), None, "Bob n'est plus dans l'annuaire");
    }
}
