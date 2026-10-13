#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn somme_d_un_tableau() {
        assert_eq!(somme(&[1, 2, 3]), 6, "1 + 2 + 3 = 6");
        assert_eq!(somme(&[]), 0, "la somme d'une liste vide vaut 0");
    }

    #[test]
    fn somme_d_un_vec() {
        let v = vec![10, -5, 7];
        assert_eq!(somme(&v), 12, "10 - 5 + 7 = 12");
        assert_eq!(v.len(), 3, "le Vec doit rester utilisable après l'appel");
    }

    #[test]
    fn somme_d_un_morceau() {
        let v = vec![1, 2, 3, 4, 5];
        assert_eq!(somme(&v[1..3]), 5, "le morceau [2, 3] fait 5");
    }

    #[test]
    fn moyenne_des_notes() {
        let notes = vec![12, 15, 9];
        assert_eq!(moyenne(&notes), 12.0, "la moyenne de 12, 15 et 9 vaut 12");
        assert_eq!(notes, vec![12, 15, 9], "les notes doivent rester utilisables");
    }
}
