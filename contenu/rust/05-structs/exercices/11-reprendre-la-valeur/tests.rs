#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn pile_neuve() {
        let pile: PileFixe<String, 3> = PileFixe::new();
        assert_eq!(pile.taille(), 0, "une pile neuve est vide");
        assert_eq!(pile.sommet(), None, "une pile vide n'a pas de sommet");
    }

    #[test]
    fn reprendre_une_string() {
        let mut pile: PileFixe<String, 3> = PileFixe::new();
        assert!(pile.empiler("crabe".to_string()), "1re String acceptée");
        assert!(pile.empiler("ferris".to_string()), "2e String acceptée");
        let mot: Option<String> = pile.depiler();
        assert_eq!(mot, Some("ferris".to_string()), "on récupère la dernière String empilée");
        assert_eq!(pile.taille(), 1, "il reste un élément");
        assert_eq!(pile.depiler(), Some("crabe".to_string()), "puis la première");
        assert_eq!(pile.depiler(), None, "la pile est vide");
    }

    #[test]
    fn la_case_est_videe() {
        let mut pile: PileFixe<String, 2> = PileFixe::new();
        let _ = pile.empiler("a".to_string());
        let _ = pile.depiler();
        assert!(pile.cases[0].is_none(), "après depiler, la case doit contenir None (utilise take)");
    }

    #[test]
    fn pile_pleine() {
        let mut pile: PileFixe<u8, 2> = PileFixe::new();
        assert!(pile.empiler(1), "1er élément accepté");
        assert!(pile.empiler(2), "2e élément accepté");
        assert!(!pile.empiler(3), "une pile de 2 cases refuse le 3e");
        assert_eq!(pile.taille(), 2, "un empilement refusé ne change pas la taille");
        assert_eq!(pile.sommet(), Some(&2), "le sommet reste le dernier élément accepté");
    }

    #[test]
    fn sommet_ne_retire_rien() {
        let mut pile: PileFixe<String, 3> = PileFixe::new();
        let _ = pile.empiler("x".to_string());
        assert_eq!(pile.sommet().map(String::as_str), Some("x"), "le sommet est x");
        assert_eq!(pile.taille(), 1, "sommet ne retire rien");
        assert_eq!(pile.depiler(), Some("x".to_string()), "x est toujours là");
    }

    #[test]
    fn reutiliser_les_cases() {
        let mut pile: PileFixe<String, 1> = PileFixe::new();
        let _ = pile.empiler("un".to_string());
        let _ = pile.depiler();
        assert!(pile.empiler("deux".to_string()), "la case libérée peut resservir");
        assert_eq!(pile.depiler(), Some("deux".to_string()), "on récupère la nouvelle valeur");
    }
}
