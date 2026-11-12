#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn double_somme_simple() {
        assert_eq!(block_on(double_somme(2, 3)), 10, "double_somme(2, 3)");
    }

    #[test]
    fn double_somme_zero() {
        assert_eq!(block_on(double_somme(0, 0)), 0, "double_somme(0, 0)");
        assert_eq!(block_on(double_somme(10, 5)), 30, "double_somme(10, 5)");
    }

    #[test]
    fn bonjour_nom() {
        assert_eq!(block_on(bonjour("Ada")), "Bonjour Ada !", "bonjour(\"Ada\")");
        assert_eq!(block_on(bonjour("Linus")), "Bonjour Linus !", "bonjour(\"Linus\")");
    }
}
