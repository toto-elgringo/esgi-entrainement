#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn nombres() {
        assert_eq!(extraire_nombres("j'ai 3 chats et 12 poissons"), vec![3, 12], "3 et 12 sont les seuls nombres");
        assert_eq!(extraire_nombres("il reste 10 places sur 120 !"), vec![10, 120], "10 et 120, dans l'ordre");
        assert_eq!(extraire_nombres("-4 et 7"), vec![7], "-4 n'est pas un entier positif");
        assert!(extraire_nombres("aucun nombre ici").is_empty(), "aucun nombre : liste vide");
    }

    #[test]
    fn domaines_des_emails() {
        assert_eq!(
            domaines(&["ana@esgi.fr", "pas-un-email", "leo@mail.com"]),
            vec!["esgi.fr", "mail.com"],
            "l'adresse sans @ est ignorée"
        );
        assert_eq!(domaines(&["mia@", "zoe@exemple.org"]), vec!["exemple.org"], "« mia@ » n'a rien après le @ : ignorée");
        assert!(domaines(&[]).is_empty(), "aucune adresse : liste vide");
    }

    #[test]
    fn mots() {
        assert_eq!(
            tous_les_mots(&["Le chat", "dort ICI"]),
            vec!["le", "chat", "dort", "ici"],
            "les mots des deux phrases, bout à bout, en minuscules"
        );
        assert_eq!(
            tous_les_mots(&["  Un  ", "", "Deux Trois"]),
            vec!["un", "deux", "trois"],
            "les espaces en trop et les phrases vides ne donnent aucun mot"
        );
    }

    #[test]
    fn grille() {
        assert_eq!(cases("ab", 3), vec!["a1", "a2", "a3", "b1", "b2", "b3"], "colonne a, puis colonne b");
        assert_eq!(cases("xyz", 1), vec!["x1", "y1", "z1"], "une seule ligne");
        assert!(cases("abc", 0).is_empty(), "aucune ligne : aucune case");
        assert!(cases("", 5).is_empty(), "aucune colonne : aucune case");
    }
}
