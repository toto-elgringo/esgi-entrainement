#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn double_fonctionne() {
        assert_eq!(double(21), 42, "le double de 21 est 42");
        assert_eq!(double(-5), -10, "le double de -5 est -10");
    }
}
