#[cfg(test)]
mod tests {
    use super::*;

    fn liste(elements: &[&str]) -> Liste {
        Liste(elements.iter().map(|e| e.to_string()).collect())
    }

    #[test]
    fn affichage_liste() {
        assert_eq!(liste(&["a", "b", "c"]).to_string(), "[a, b, c]", "trois éléments séparés par une virgule");
    }

    #[test]
    fn affichage_un_element() {
        assert_eq!(liste(&["seul"]).to_string(), "[seul]", "un seul élément, pas de virgule");
    }

    #[test]
    fn affichage_liste_vide() {
        assert_eq!(liste(&[]).to_string(), "[]", "une liste vide s'affiche []");
    }

    #[test]
    fn resume_nombre() {
        assert_eq!(42_i32.resume(), "<42>", "un nombre est Display, donc il a resume()");
    }

    #[test]
    fn resume_texte() {
        assert_eq!("salut".resume(), "<salut>", "un &str est Display, donc il a resume()");
        assert_eq!(String::from("ok").resume(), "<ok>", "un String aussi");
    }

    #[test]
    fn resume_liste() {
        assert_eq!(liste(&["a", "b"]).resume(), "<[a, b]>", "Liste est Display, donc elle a resume()");
    }
}
