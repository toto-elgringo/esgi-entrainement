#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn initiale_presente() {
        assert_eq!(initiale(&["rust", "cargo"], 1), "C", "le mot d'index 1 est cargo : C");
    }

    #[test]
    fn initiale_hors_limites() {
        assert_eq!(initiale(&["rust"], 5), "?", "l'index 5 n'existe pas : \"?\" sans panique");
    }

    #[test]
    fn initiale_mot_vide() {
        assert_eq!(initiale(&[""], 0), "?", "un mot vide n'a pas de première lettre");
    }

    #[test]
    fn initiale_accentuee() {
        assert_eq!(initiale(&["élan"], 0), "É", "la majuscule d'un é est É");
    }

    #[test]
    fn inverse_normal() {
        assert_eq!(inverse(4.0), Some(0.25), "1 / 4 vaut 0,25");
    }

    #[test]
    fn inverse_de_zero() {
        assert_eq!(inverse(0.0), None, "pas d'inverse pour 0");
    }

    #[test]
    fn chaine_reussie() {
        assert_eq!(inverse_de_inverse_plus_un(4.0), Some(5.0), "1 / (1 / 4) + 1 vaut 5");
    }

    #[test]
    fn chaine_interrompue() {
        assert_eq!(inverse_de_inverse_plus_un(0.0), None, "dès que l'inverse échoue, la chaîne donne None");
    }
}
