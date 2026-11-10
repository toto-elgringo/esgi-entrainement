#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn avec_des_octets() {
        let mut pile = PileFixe::depuis_tableau([0u8; 3]);
        assert_eq!(pile.taille(), 0, "une pile neuve est vide");
        assert_eq!(pile.capacite(), 3, "une pile faite d'un tableau de 3 cases a une capacité de 3");
        assert!(pile.empiler(1), "1er élément accepté");
        assert!(pile.empiler(2), "2e élément accepté");
        assert!(pile.empiler(3), "3e élément accepté");
        assert!(!pile.empiler(4), "la pile pleine refuse le 4e élément");
        assert_eq!(pile.depiler(), Some(&3), "on dépile le dernier arrivé");
        assert_eq!(pile.taille(), 2, "il reste 2 éléments");
    }

    #[test]
    fn avec_des_flottants() {
        let mut pile = PileFixe::depuis_tableau([0.0f64; 5]);
        assert_eq!(pile.capacite(), 5, "la capacité vient de la taille du tableau");
        let _ = pile.empiler(1.5);
        let _ = pile.empiler(2.5);
        assert_eq!(pile.depiler(), Some(&2.5), "on dépile 2.5 en premier");
        assert_eq!(pile.depiler(), Some(&1.5), "puis 1.5");
        assert_eq!(pile.depiler(), None, "la pile est vide");
    }

    #[test]
    fn avec_des_str() {
        let mut pile = PileFixe::depuis_tableau([""; 2]);
        let _ = pile.empiler("crabe");
        let _ = pile.empiler("ferris");
        assert!(!pile.empiler("cargo"), "une pile de 2 cases refuse un 3e mot");
        assert_eq!(pile.depiler(), Some(&"ferris"), "dernier mot empilé");
    }

    #[test]
    fn avec_des_string() {
        let mut pile = PileFixe::depuis_tableau([String::new(), String::new()]);
        assert!(pile.empiler("Ferris".to_string()), "une String doit pouvoir être empilée");
        assert_eq!(pile.depiler().map(String::as_str), Some("Ferris"), "on retrouve la String empilée");
        assert_eq!(pile.depiler(), None, "la pile est vide");
    }

    #[test]
    fn pile_de_zero_case() {
        let mut pile: PileFixe<u8, 0> = PileFixe::depuis_tableau([]);
        assert_eq!(pile.capacite(), 0, "une pile sans case a une capacité de 0");
        assert!(!pile.empiler(1), "une pile sans case refuse tout");
    }
}
