#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hello_world() {
        assert_eq!(construire(), "Hello, World!", "construire() doit renvoyer \"Hello, World!\"");
    }
}
