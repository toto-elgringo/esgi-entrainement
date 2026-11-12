#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn affichage_livre() {
        let l = Livre { titre: "Rust".to_string(), prix: 2990 };
        assert_eq!(l.to_string(), "Livre Rust", "un livre s'affiche « Livre <titre> »");
    }

    #[test]
    fn affichage_stylo() {
        let s = Stylo { couleur: "bleu".to_string() };
        assert_eq!(s.to_string(), "Stylo bleu", "un stylo s'affiche « Stylo <couleur> »");
    }

    #[test]
    fn etiquette_livre() {
        let l = Livre { titre: "Rust".to_string(), prix: 2990 };
        assert_eq!(l.etiquette(), "Livre Rust : 29.90 €", "2990 centimes font 29.90 €");
    }

    #[test]
    fn etiquette_stylo() {
        let s = Stylo { couleur: "bleu".to_string() };
        assert_eq!(s.etiquette(), "Stylo bleu : 1.50 €", "150 centimes font 1.50 € (deux décimales)");
    }

    #[test]
    fn etiquette_prix_rond() {
        let l = Livre { titre: "Fin".to_string(), prix: 500 };
        assert_eq!(l.etiquette(), "Livre Fin : 5.00 €", "500 centimes font 5.00 €");
    }
}
