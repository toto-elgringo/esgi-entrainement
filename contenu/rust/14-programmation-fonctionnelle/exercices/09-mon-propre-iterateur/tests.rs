#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn next_avance_la_suite() {
        let mut fib = Fibonacci::new();
        assert_eq!(fib.next(), Some(0), "la suite commence par 0");
        assert_eq!(fib.next(), Some(1), "puis 1");
        assert_eq!(fib.next(), Some(1), "puis 0 + 1 = 1");
        assert_eq!(fib.next(), Some(2), "puis 1 + 1 = 2");
        assert_eq!(fib.next(), Some(3), "puis 1 + 2 = 3");
        assert_eq!(Fibonacci::new().nth(10), Some(55), "le nombre à l'indice 10 est 55");
    }

    #[test]
    fn premiers() {
        assert_eq!(fibonacci_premiers(7), vec![0, 1, 1, 2, 3, 5, 8], "les 7 premiers nombres");
        assert!(fibonacci_premiers(0).is_empty(), "0 nombre : liste vide");
        assert_eq!(fibonacci_premiers(50).last(), Some(&7_778_742_049), "le 50ᵉ nombre est 7 778 742 049");
    }

    #[test]
    fn pairs() {
        assert_eq!(fibonacci_pairs(4), vec![0, 2, 8, 34], "les 4 premiers nombres pairs");
        assert_eq!(fibonacci_pairs(6), vec![0, 2, 8, 34, 144, 610], "les 6 premiers nombres pairs");
    }

    #[test]
    fn sous_une_limite() {
        assert_eq!(fibonacci_sous(20), vec![0, 1, 1, 2, 3, 5, 8, 13], "21 n'est pas strictement inférieur à 20");
        assert_eq!(fibonacci_sous(1), vec![0], "seul 0 est inférieur à 1");
        assert!(fibonacci_sous(0).is_empty(), "aucun nombre n'est inférieur à 0");
    }

    #[test]
    fn chiffres_de_droite_a_gauche() {
        assert_eq!(chiffres(4072).collect::<Vec<u64>>(), vec![2, 7, 0, 4], "les chiffres de 4072, unités d'abord");
        assert_eq!(chiffres(0).collect::<Vec<u64>>(), vec![0], "0 a un chiffre : 0");
        assert_eq!(chiffres(9).collect::<Vec<u64>>(), vec![9], "9 a un seul chiffre");
        assert_eq!(chiffres(999).sum::<u64>(), 27, "9 + 9 + 9 = 27");
        assert_eq!(chiffres(u64::MAX).next(), Some(5), "18 446 744 073 709 551 615 se termine par 5");
    }
}
