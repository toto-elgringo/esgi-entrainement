#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn doubler_les_elements() {
        let mut v = vec![1, 2, 3];
        doubler(&mut v);
        assert_eq!(v, vec![2, 4, 6], "[1, 2, 3] doublé donne [2, 4, 6]");
    }

    #[test]
    fn plafonner_les_elements() {
        let mut v = vec![5, 12, 8, 20];
        plafonner(&mut v, 10);
        assert_eq!(v, vec![5, 10, 8, 10], "les éléments au-dessus de 10 deviennent 10");
    }

    #[test]
    fn plafonner_sans_changement() {
        let mut v = vec![1, 2];
        plafonner(&mut v, 10);
        assert_eq!(v, vec![1, 2], "rien ne dépasse 10 : la liste ne change pas");
    }

    #[test]
    fn ajouter_a_la_fin() {
        let mut v = vec![1];
        ajouter_fin(&mut v, &[2, 3]);
        assert_eq!(v, vec![1, 2, 3], "[1] + [2, 3] donne [1, 2, 3]");
        ajouter_fin(&mut v, &[]);
        assert_eq!(v, vec![1, 2, 3], "ajouter une liste vide ne change rien");
    }
}
