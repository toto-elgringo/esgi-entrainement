#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn somme_de_neuf_millions() {
        assert_eq!(somme_grand_tableau(), 9_000_000, "9 millions de cases valant 1 : la somme vaut 9 000 000");
    }
}
