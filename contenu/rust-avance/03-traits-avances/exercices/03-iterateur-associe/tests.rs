#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn decompte_simple() {
        let v: Vec<u64> = Decompte::new(3).collect();
        assert_eq!(v, vec![3, 2, 1], "Decompte::new(3) doit produire 3, 2, 1");
    }

    #[test]
    fn decompte_vide() {
        assert_eq!(Decompte::new(0).count(), 0, "Decompte::new(0) ne produit rien");
    }

    #[test]
    fn decompte_avec_les_outils_gratuits() {
        let somme: u64 = Decompte::new(4).map(|n| n * 2).sum();
        assert_eq!(somme, 20, "2 * (4 + 3 + 2 + 1) = 20");
    }

    #[test]
    fn fibonacci_premiers_termes() {
        let v: Vec<u64> = Fibonacci::new().take(8).collect();
        assert_eq!(v, vec![0, 1, 1, 2, 3, 5, 8, 13], "les 8 premiers termes de Fibonacci");
    }

    #[test]
    fn fibonacci_filtre() {
        let v: Vec<u64> = Fibonacci::new().filter(|n| n % 2 == 0).take(4).collect();
        assert_eq!(v, vec![0, 2, 8, 34], "les 4 premiers termes pairs");
    }

    #[test]
    fn fibonacci_vingtieme() {
        assert_eq!(Fibonacci::new().nth(20), Some(6765), "le terme d'indice 20 vaut 6765");
    }
}
