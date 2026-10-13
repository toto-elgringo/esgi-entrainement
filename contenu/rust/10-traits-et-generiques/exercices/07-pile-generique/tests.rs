#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn pile_neuve() {
        let pile: Pile<i32> = Pile::new();
        assert!(pile.est_vide(), "une pile neuve est vide");
        assert_eq!(pile.taille(), 0, "une pile neuve a 0 élément");
        assert_eq!(pile.sommet(), None, "une pile neuve n'a pas de sommet");
    }

    #[test]
    fn empiler_et_depiler() {
        let mut pile = Pile::new();
        pile.empiler(1);
        pile.empiler(2);
        pile.empiler(3);
        assert_eq!(pile.taille(), 3, "3 éléments empilés");
        assert_eq!(pile.sommet(), Some(&3), "le dernier empilé est au sommet");
        assert_eq!(pile.depiler(), Some(3), "on retire d'abord le dernier empilé");
        assert_eq!(pile.depiler(), Some(2), "puis l'avant-dernier");
        assert_eq!(pile.depiler(), Some(1), "puis le premier");
        assert_eq!(pile.depiler(), None, "la pile est vide : None");
        assert!(pile.est_vide(), "la pile est vide à la fin");
    }

    #[test]
    fn pile_de_textes() {
        let mut pile = Pile::new();
        pile.empiler("bas".to_string());
        pile.empiler("haut".to_string());
        assert_eq!(pile.sommet(), Some(&"haut".to_string()), "la pile marche aussi avec des String");
    }

    #[test]
    fn affichage() {
        let mut pile = Pile::new();
        assert_eq!(pile.afficher(), "(vide)", "une pile vide s'affiche (vide)");
        pile.empiler(1);
        pile.empiler(2);
        pile.empiler(3);
        assert_eq!(pile.afficher(), "1 | 2 | 3", "du bas vers le haut");
        pile.depiler();
        assert_eq!(pile.afficher(), "1 | 2", "après un dépilement");
    }
}
