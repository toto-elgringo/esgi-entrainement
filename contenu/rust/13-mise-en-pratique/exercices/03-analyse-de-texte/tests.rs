#[cfg(test)]
mod tests {
    use super::*;

    const TEXTE: &str = "Le chat et le chien. LE chat !";

    #[test]
    fn nombre_de_mots() {
        assert_eq!(compter_mots(TEXTE), 7, "le, chat, et, le, chien, le, chat : 7 mots");
        assert_eq!(compter_mots("l'été est là"), 4, "l, été, est, là : l'apostrophe sépare les mots");
        assert_eq!(compter_mots(""), 0, "texte vide : 0 mot");
        assert_eq!(compter_mots("  ... !  "), 0, "que de la ponctuation : 0 mot");
    }

    #[test]
    fn table_des_frequences() {
        let table = frequences(TEXTE);
        assert_eq!(table.get("le"), Some(&3), "« le » apparaît 3 fois (majuscules comprises)");
        assert_eq!(table.get("chat"), Some(&2), "« chat » apparaît 2 fois");
        assert_eq!(table.get("chien"), Some(&1), "« chien » apparaît 1 fois");
        assert_eq!(table.len(), 4, "4 mots différents : le, chat, et, chien");
    }

    #[test]
    fn le_plus_frequent() {
        assert_eq!(mot_le_plus_frequent(TEXTE), Some(("le".to_string(), 3)), "« le » gagne avec 3 apparitions");
        assert_eq!(mot_le_plus_frequent(""), None, "texte vide : None");
    }

    #[test]
    fn egalite_ordre_alphabetique() {
        assert_eq!(mot_le_plus_frequent("b a b a"), Some(("a".to_string(), 2)), "égalité : « a » passe avant « b »");
    }
}
