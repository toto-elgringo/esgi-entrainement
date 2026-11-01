#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 303, "72 + 33 + 44 + 0 + 55 + 0 + 99 = 303");
    }

    #[test]
    fn partie1_un_seul_chiffre() {
        assert_eq!(partie1("ab3cd"), 33, "un seul chiffre : il est à la fois le premier et le dernier");
    }

    #[test]
    fn partie1_sans_chiffre() {
        assert_eq!(partie1("eight\nk5"), 55, "en partie 1, « eight » n'est pas un chiffre et la ligne compte pour 0");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 423, "72 + 53 + 42 + 21 + 59 + 77 + 99 = 423");
    }

    #[test]
    fn partie2_mots_qui_se_chevauchent() {
        assert_eq!(partie2("eightwo"), 82, "« eightwo » contient eight puis two : 82");
        assert_eq!(partie2("xoneight"), 18, "« oneight » contient one puis eight : 18");
    }

    #[test]
    fn partie2_zero_ne_compte_pas() {
        assert_eq!(partie2("zero3"), 33, "« zero » ne fait pas partie des mots à reconnaître");
    }

    #[test]
    fn fins_de_ligne_windows() {
        assert_eq!(partie2("1two\r\nthree4\r\n"), 46, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
