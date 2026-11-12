#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn somme_vide() {
        assert_eq!(somme(&[]), 0, "la somme d'une liste vide vaut 0");
    }

    #[test]
    fn somme_normale() {
        assert_eq!(somme(&[1, 2, 3, 4]), 10, "1 + 2 + 3 + 4 vaut 10");
    }

    #[test]
    fn somme_negative() {
        assert_eq!(somme(&[5, -8, 1]), -2, "5 - 8 + 1 vaut -2");
    }

    #[test]
    fn minimum_vide() {
        assert_eq!(minimum(&[]), None, "pas de minimum dans une liste vide");
    }

    #[test]
    fn minimum_un_element() {
        assert_eq!(minimum(&[7]), Some(7), "le seul élément est le minimum");
    }

    #[test]
    fn minimum_normal() {
        assert_eq!(minimum(&[5, 2, 9]), Some(2), "le plus petit de 5, 2, 9 est 2");
    }

    #[test]
    fn minimum_au_debut() {
        assert_eq!(minimum(&[-4, 3, 8, 1]), Some(-4), "le minimum peut être le premier");
    }
}
