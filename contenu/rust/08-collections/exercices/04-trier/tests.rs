#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sans_doublons() {
        assert_eq!(trier_sans_doublons(vec![3, 1, 3, 2, 1]), vec![1, 2, 3], "[3, 1, 3, 2, 1] donne [1, 2, 3]");
        assert_eq!(trier_sans_doublons(vec![]), Vec::<i32>::new(), "une liste vide reste vide");
        assert_eq!(trier_sans_doublons(vec![4, 4, 4]), vec![4], "[4, 4, 4] donne [4]");
    }

    #[test]
    fn podium() {
        assert_eq!(trois_plus_grands(&[5, 1, 9, 7, 3]), vec![9, 7, 5], "les trois plus grands de [5, 1, 9, 7, 3]");
        assert_eq!(trois_plus_grands(&[2, 8]), vec![8, 2], "seulement deux éléments : [8, 2]");
        assert_eq!(trois_plus_grands(&[]), Vec::<u32>::new(), "liste vide : résultat vide");
    }

    #[test]
    fn la_liste_de_depart_ne_change_pas() {
        let notes = vec![5, 1, 9];
        trois_plus_grands(&notes);
        assert_eq!(notes, vec![5, 1, 9], "trois_plus_grands ne doit pas modifier la liste reçue");
    }

    #[test]
    fn alphabetique() {
        assert_eq!(
            ordre_alphabetique(vec!["poire", "abricot", "mangue"]),
            vec!["abricot", "mangue", "poire"],
            "ordre alphabétique"
        );
    }
}
