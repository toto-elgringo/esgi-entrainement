#[cfg(test)]
mod tests {
    use super::*;

    structure!(Rectangle {
        largeur: f64,
        hauteur: f64,
    });

    structure!(Livre { titre: String });

    #[test]
    fn getter_texte() {
        let p = Personne { nom: String::from("Ada"), age: 36 };
        assert_eq!(p.nom(), "Ada", "le getter nom renvoie le champ nom");
    }

    #[test]
    fn getter_nombre() {
        let p = Personne { nom: String::from("Ada"), age: 36 };
        assert_eq!(*p.age(), 36, "le getter age renvoie le champ age");
    }

    #[test]
    fn autre_structure() {
        let r = Rectangle { largeur: 3.0, hauteur: 4.5 };
        assert_eq!(*r.largeur(), 3.0, "getter largeur");
        assert_eq!(*r.hauteur(), 4.5, "getter hauteur");
    }

    #[test]
    fn un_seul_champ_sans_virgule() {
        let l = Livre { titre: String::from("Rust") };
        assert_eq!(l.titre(), "Rust", "structure à un champ, sans virgule finale");
    }
}
