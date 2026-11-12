#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn quatre_threads() {
        assert_eq!(compter(4, 1000), 4000, "4 threads x 1000 incréments");
    }

    #[test]
    fn un_thread() {
        assert_eq!(compter(1, 5), 5, "un seul thread");
    }

    #[test]
    fn aucun_thread() {
        assert_eq!(compter(0, 100), 0, "sans thread, le compteur reste à 0");
    }

    #[test]
    fn beaucoup_de_threads() {
        assert_eq!(compter(16, 500), 8000, "aucun incrément ne doit être perdu");
    }
}
