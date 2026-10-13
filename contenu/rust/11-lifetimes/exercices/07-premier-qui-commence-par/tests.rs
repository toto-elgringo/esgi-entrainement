#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trouve_le_premier() {
        let mots = ["pomme", "poire", "banane"];
        assert_eq!(premier_qui_commence_par(&mots, "po"), Some("pomme"), "pomme est le premier mot en po");
        assert_eq!(premier_qui_commence_par(&mots, "ban"), Some("banane"), "banane commence par ban");
    }

    #[test]
    fn rien_trouve() {
        let mots = ["pomme", "poire", "banane"];
        assert_eq!(premier_qui_commence_par(&mots, "ki"), None, "aucun mot ne commence par ki");
        assert_eq!(premier_qui_commence_par(&[], "a"), None, "liste vide : None");
    }

    #[test]
    fn le_resultat_survit_au_prefixe() {
        let mots = ["pomme", "poire", "banane"];
        let resultat;
        {
            let prefixe = String::from("ba");
            resultat = premier_qui_commence_par(&mots, &prefixe);
        }
        assert_eq!(resultat, Some("banane"), "le résultat ne dépend que de la liste de mots");
    }
}
