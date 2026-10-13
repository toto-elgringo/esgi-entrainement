#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn salutations() {
        assert_eq!(creer_salutation("Léa"), "Bonjour, Léa !", "salutation de Léa");
        assert_eq!(creer_salutation("Ferris"), "Bonjour, Ferris !", "salutation de Ferris");
    }

    #[test]
    fn repetitions() {
        assert_eq!(repeter("ha", 3), "hahaha", "ha répété 3 fois");
        assert_eq!(repeter("x", 1), "x", "x répété 1 fois");
        assert_eq!(repeter("x", 0), "", "répété 0 fois : texte vide");
    }

    #[test]
    fn le_resultat_survit_au_parametre() {
        let resultat;
        {
            let nom = String::from("Sam");
            resultat = creer_salutation(&nom);
        }
        assert_eq!(resultat, "Bonjour, Sam !", "le résultat possède son propre texte");
    }
}
