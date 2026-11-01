#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 10, "les caractères 7 à 10 (z, y, x, w) sont les 4 premiers tous différents");
    }

    #[test]
    fn partie1_marqueur_au_debut() {
        assert_eq!(partie1("abcdefg"), 4, "les 4 premiers caractères sont déjà tous différents");
    }

    #[test]
    fn partie1_lettre_qui_revient() {
        assert_eq!(partie1("abcadefg"), 5, "« abca » a deux a, mais « bcad » est bon : 5 caractères lus");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 25, "les caractères 12 à 25 sont les 14 premiers tous différents");
    }

    #[test]
    fn sans_marqueur() {
        assert_eq!(partie1("ababab"), 0, "aucun groupe de 4 caractères tous différents : 0");
    }

    #[test]
    fn fins_de_ligne_windows() {
        assert_eq!(partie1("xxxyz\r\n"), 0, "le retour à la ligne final (\r\n) ne fait pas partie du signal");
    }
}
