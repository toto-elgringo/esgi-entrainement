#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn compte_de_un_en_un() {
        assert_eq!(suivant(), 1, "premier appel : 1");
        assert_eq!(suivant(), 2, "deuxième appel : 2");
        assert_eq!(suivant(), 3, "troisième appel : 3");
    }
}
