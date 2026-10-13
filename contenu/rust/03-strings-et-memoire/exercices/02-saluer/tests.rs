#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn texte_du_code() {
        assert_eq!(saluer("Bob"), "Bonjour Bob !", "saluer(\"Bob\") doit renvoyer \"Bonjour Bob !\"");
    }

    #[test]
    fn string_empruntee() {
        let prenom = String::from("Alice");
        assert_eq!(saluer(&prenom), "Bonjour Alice !", "saluer(&prenom) doit renvoyer \"Bonjour Alice !\"");
        assert_eq!(prenom, "Alice", "prenom doit rester utilisable après l'appel");
    }

    #[test]
    fn morceau_de_texte() {
        let phrase = String::from("Charlie Chaplin");
        assert_eq!(saluer(&phrase[0..7]), "Bonjour Charlie !", "on peut saluer un morceau de texte");
    }
}
