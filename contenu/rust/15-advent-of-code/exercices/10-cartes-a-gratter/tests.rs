#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 9, "les cartes de l'exemple rapportent 4 + 2 + 2 + 1 = 9 points");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 29, "à la fin de l'exemple, tu as 29 cartes");
    }

    #[test]
    fn carte_perdante() {
        assert_eq!(partie1("Card 1: 1 2 3 | 4 5 6"), 0, "une carte sans numéro gagnant rapporte 0 point");
        assert_eq!(partie2("Card 1: 1 2 3 | 4 5 6"), 1, "une seule carte perdante : tu gardes juste cette carte");
    }

    #[test]
    fn points_doubles() {
        assert_eq!(
            partie1("Card 1: 1 2 3 4 5 | 5 4 3 2 1 9"),
            16,
            "5 numéros trouvés : 1, puis doublé 4 fois = 16 points"
        );
    }

    #[test]
    fn espaces_multiples() {
        assert_eq!(
            partie1("Card   7:  1  2  3 |  2  9  1"),
            2,
            "les espaces en trop (après « Card » et devant les petits nombres) ne gênent pas"
        );
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = "Card 1: 1 2 | 1 3\r\nCard 2: 4 5 | 6 7\r\n";
        assert_eq!(partie1(entree), 1, "les fins de ligne Windows (\\r\\n) sont gérées");
        assert_eq!(partie2(entree), 3, "la carte 1 fait gagner une copie de la carte 2 : 3 cartes");
    }
}
