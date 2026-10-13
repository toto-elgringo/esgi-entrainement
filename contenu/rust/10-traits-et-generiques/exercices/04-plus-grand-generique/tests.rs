#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn entiers() {
        assert_eq!(plus_grand(3, 7), 7, "le plus grand de 3 et 7");
        assert_eq!(plus_grand(-1, -5), -1, "le plus grand de -1 et -5");
    }

    #[test]
    fn autres_types() {
        assert_eq!(plus_grand(2.5, 1.5), 2.5, "marche avec des f64");
        assert_eq!(plus_grand("pomme", "banane"), "pomme", "marche avec des &str (ordre alphabétique)");
        assert_eq!(plus_grand('a', 'z'), 'z', "marche avec des char");
    }

    #[test]
    fn liste_de_nombres() {
        assert_eq!(plus_grand_de_la_liste(&[3, 9, 2]), Some(9), "le plus grand de [3, 9, 2]");
        assert_eq!(plus_grand_de_la_liste(&[1.5, -2.0]), Some(1.5), "le plus grand de [1.5, -2.0]");
    }

    #[test]
    fn liste_de_lettres() {
        assert_eq!(plus_grand_de_la_liste(&['x', 'b']), Some('x'), "la plus grande lettre de ['x', 'b']");
    }

    #[test]
    fn liste_vide() {
        let vide: [i32; 0] = [];
        assert_eq!(plus_grand_de_la_liste(&vide), None, "liste vide : None");
    }
}
