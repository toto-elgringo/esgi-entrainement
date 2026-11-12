#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exemple() {
        assert_eq!(compter_pairs(&[1, 2, 3, 4, 5, 6], 2), 3, "3 nombres pairs dans 1..6");
    }

    #[test]
    fn aucun_pair() {
        assert_eq!(compter_pairs(&[1, 3, 5], 2), 0, "aucun nombre pair");
    }

    #[test]
    fn tableau_vide() {
        assert_eq!(compter_pairs(&[], 4), 0, "un tableau vide n'a aucun pair");
    }

    #[test]
    fn dernier_morceau_court() {
        assert_eq!(compter_pairs(&[2, 4, 6, 8, 10], 3), 5, "le dernier morceau est plus court");
    }

    #[test]
    fn grand_tableau() {
        let nombres: Vec<u32> = (1..=10_000).collect();
        assert_eq!(compter_pairs(&nombres, 100), 5000, "la moitié des nombres de 1 à 10000 sont pairs");
    }
}
