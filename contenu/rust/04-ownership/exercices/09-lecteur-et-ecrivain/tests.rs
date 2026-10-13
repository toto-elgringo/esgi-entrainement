#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn dupliquer() {
        let mut v = vec![1, 2, 3];
        assert_eq!(dupliquer_le_premier(&mut v), 1, "le premier élément de [1, 2, 3] est 1");
        assert_eq!(v, vec![1, 2, 3, 1], "la liste doit devenir [1, 2, 3, 1]");
    }

    #[test]
    fn dupliquer_un_seul_element() {
        let mut v = vec![7];
        assert_eq!(dupliquer_le_premier(&mut v), 7, "le premier élément de [7] est 7");
        assert_eq!(v, vec![7, 7], "la liste doit devenir [7, 7]");
    }

    #[test]
    fn doubles() {
        let mut v = vec![1, 2, 3];
        ajouter_les_doubles(&mut v);
        assert_eq!(v, vec![1, 2, 3, 2, 4, 6], "on ajoute 2, 4 et 6 à la fin");
    }

    #[test]
    fn doubles_negatifs() {
        let mut v = vec![-5, 0];
        ajouter_les_doubles(&mut v);
        assert_eq!(v, vec![-5, 0, -10, 0], "on ajoute -10 et 0 à la fin");
    }
}
