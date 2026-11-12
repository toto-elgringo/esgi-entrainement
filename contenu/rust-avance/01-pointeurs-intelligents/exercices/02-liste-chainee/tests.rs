#[cfg(test)]
mod tests {
    use super::*;

    fn exemple() -> Liste {
        Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Vide))))))
    }

    #[test]
    fn la_somme() {
        assert_eq!(somme(&exemple()), 6, "1 + 2 + 3");
        assert_eq!(somme(&Vide), 0, "liste vide : 0");
    }

    #[test]
    fn la_longueur() {
        assert_eq!(longueur(&exemple()), 3, "trois éléments");
        assert_eq!(longueur(&Vide), 0, "liste vide : 0");
    }

    #[test]
    fn la_recherche() {
        assert!(contient(&exemple(), 2), "2 est dans la liste");
        assert!(!contient(&exemple(), 9), "9 n'est pas dans la liste");
        assert!(!contient(&Vide, 1), "rien dans une liste vide");
    }

    #[test]
    fn construction() {
        let liste = depuis_tranche(&[5, 6, 7, 8]);
        assert_eq!(longueur(&liste), 4, "quatre éléments");
        assert_eq!(somme(&liste), 26, "5 + 6 + 7 + 8");
        match depuis_tranche(&[9, 1]) {
            Cons(premier, _) => assert_eq!(premier, 9, "le premier élément reste en tête"),
            Vide => panic!("la liste ne doit pas être vide"),
        }
        assert_eq!(longueur(&depuis_tranche(&[])), 0, "tranche vide : liste vide");
    }
}
