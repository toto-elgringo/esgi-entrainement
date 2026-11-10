#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn pile_neuve() {
        let pile = PileFixe3::new();
        assert_eq!(pile.taille(), 0, "une pile neuve ne contient rien");
        assert!(pile.est_vide(), "une pile neuve est vide");
        assert_eq!(pile.sommet(), None, "une pile vide n'a pas de sommet");
    }

    #[test]
    fn empiler_jusqu_a_trois() {
        let mut pile = PileFixe3::new();
        assert!(pile.empiler(10), "le 1er élément doit être accepté");
        assert!(pile.empiler(20), "le 2e élément doit être accepté");
        assert!(pile.empiler(30), "le 3e élément doit être accepté");
        assert_eq!(pile.taille(), 3, "après 3 empilements, la taille vaut 3");
        assert!(!pile.est_vide(), "une pile avec 3 éléments n'est pas vide");
    }

    #[test]
    fn pile_pleine() {
        let mut pile = PileFixe3::new();
        let _ = pile.empiler(1);
        let _ = pile.empiler(2);
        let _ = pile.empiler(3);
        assert!(!pile.empiler(4), "une pile pleine doit refuser un 4e élément");
        assert_eq!(pile.taille(), 3, "un empilement refusé ne change pas la taille");
        assert_eq!(pile.sommet(), Some(&3), "un empilement refusé ne change pas le sommet");
    }

    #[test]
    fn depiler_dans_l_ordre_inverse() {
        let mut pile = PileFixe3::new();
        let _ = pile.empiler(1);
        let _ = pile.empiler(2);
        let _ = pile.empiler(3);
        assert_eq!(pile.depiler(), Some(3), "on dépile d'abord le dernier arrivé");
        assert_eq!(pile.depiler(), Some(2), "puis l'avant-dernier");
        assert_eq!(pile.depiler(), Some(1), "puis le premier");
        assert_eq!(pile.depiler(), None, "une pile vide renvoie None");
        assert!(pile.est_vide(), "la pile est vide après 3 dépilements");
    }

    #[test]
    fn sommet_ne_retire_rien() {
        let mut pile = PileFixe3::new();
        let _ = pile.empiler(7);
        let _ = pile.empiler(8);
        assert_eq!(pile.sommet(), Some(&8), "le sommet est le dernier élément empilé");
        assert_eq!(pile.sommet(), Some(&8), "regarder deux fois donne la même chose");
        assert_eq!(pile.taille(), 2, "sommet ne retire rien");
    }

    #[test]
    fn reutiliser_apres_depilement() {
        let mut pile = PileFixe3::new();
        let _ = pile.empiler(1);
        let _ = pile.empiler(2);
        let _ = pile.empiler(3);
        let _ = pile.depiler();
        assert!(pile.empiler(9), "après un dépilement, il y a de nouveau une place");
        assert_eq!(pile.sommet(), Some(&9), "le nouvel élément est en haut");
    }
}
