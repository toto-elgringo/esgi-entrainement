#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn soldes_successifs() {
        assert_eq!(soldes(100, &[-20, 50, -10]), vec![80, 130, 120], "100 - 20 = 80, + 50 = 130, - 10 = 120");
        assert_eq!(soldes(0, &[-5, 5]), vec![-5, 0], "le solde peut devenir négatif");
        assert!(soldes(100, &[]).is_empty(), "aucun mouvement : aucun solde");
    }

    #[test]
    fn avant_le_decouvert() {
        assert_eq!(
            soldes_avant_decouvert(50, &[-20, -40, 100]),
            vec![30],
            "les soldes sont 30, -10, 90 : on s'arrête avant -10, et 90 n'est pas gardé"
        );
        assert_eq!(soldes_avant_decouvert(10, &[5, -15, 3]), vec![15, 0, 3], "0 n'est pas négatif : on continue");
        assert!(soldes_avant_decouvert(10, &[-11, 50]).is_empty(), "dès le premier mouvement, le compte est à découvert");
    }

    #[test]
    fn zeros_du_debut() {
        assert_eq!(sans_zeros_au_debut(&[0, 0, 4, 0, 7]), vec![4, 0, 7], "seuls les zéros du début disparaissent");
        assert_eq!(sans_zeros_au_debut(&[5, 0]), vec![5, 0], "pas de zéro au début : rien ne change");
        assert!(sans_zeros_au_debut(&[0, 0, 0]).is_empty(), "que des zéros : liste vide");
    }

    #[test]
    fn suite_de_collatz() {
        assert_eq!(collatz(6), vec![6, 3, 10, 5, 16, 8, 4, 2, 1], "la suite qui part de 6");
        assert_eq!(collatz(1), vec![1], "la suite qui part de 1 s'arrête tout de suite");
        let longue = collatz(27);
        assert_eq!(longue.len(), 112, "la suite qui part de 27 a 112 nombres");
        assert_eq!(longue.iter().max(), Some(&9232), "elle monte jusqu'à 9232 avant de redescendre");
    }

    #[test]
    fn puissances() {
        assert_eq!(puissances_jusqu_a(3, 100), vec![1, 3, 9, 27, 81], "243 dépasse 100");
        assert_eq!(puissances_jusqu_a(10, 1000), vec![1, 10, 100, 1000], "1000 est inclus");
        assert_eq!(puissances_jusqu_a(5, 0), vec![], "même 1 dépasse 0");
        assert_eq!(
            puissances_jusqu_a(2, u64::MAX).len(),
            64,
            "de 2⁰ à 2⁶³ : 64 puissances, sans plantage (pense à checked_mul)"
        );
    }
}
