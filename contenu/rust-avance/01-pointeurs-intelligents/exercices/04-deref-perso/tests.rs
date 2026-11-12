#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn suivre_la_boite() {
        let boite = MaBoite::new(5);
        assert_eq!(*boite, 5, "*boite donne la valeur rangée");
        let texte = MaBoite::new(String::from("abc"));
        assert_eq!(*texte, "abc", "*boite donne la chaîne");
    }

    #[test]
    fn coercion() {
        let prenom = MaBoite::new(String::from("Léa"));
        assert_eq!(saluer(&prenom), "Bonjour Léa !", "saluer accepte &MaBoite<String>");
        assert_eq!(saluer("Max"), "Bonjour Max !", "saluer accepte aussi un &str");
    }

    #[test]
    fn methodes_du_contenu() {
        let boite = MaBoite::new(String::from("rust"));
        assert_eq!(boite.len(), 4, "len() de la chaîne contenue");
        let liste = MaBoite::new(vec![1, 2, 3]);
        assert_eq!(liste.iter().sum::<i32>(), 6, "iter() du Vec contenu");
    }

    #[test]
    fn lettres() {
        assert_eq!(nombre_de_lettres("été"), 3, "3 caractères, même si 5 octets");
        assert_eq!(nombre_de_lettres(&MaBoite::new(String::from("rust"))), 4, "via la boîte");
    }
}
