#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn petite_somme() {
        assert_eq!(somme_en_thread(10), 55, "la somme de 1 à 10 vaut 55");
    }

    #[test]
    fn grande_somme() {
        assert_eq!(somme_en_thread(100), 5050, "la somme de 1 à 100 vaut 5050");
    }

    #[test]
    fn somme_nulle() {
        assert_eq!(somme_en_thread(0), 0, "la somme de 1 à 0 est vide : 0");
    }
}
