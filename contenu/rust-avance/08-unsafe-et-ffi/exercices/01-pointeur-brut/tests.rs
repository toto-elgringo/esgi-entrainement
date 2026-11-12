#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lecture() {
        assert_eq!(lire(&42), 42, "lire doit renvoyer la valeur pointée");
        assert_eq!(lire(&-7), -7, "lire doit marcher avec un nombre négatif");
    }

    #[test]
    fn ecriture() {
        let mut n = 1;
        ecrire(&mut n, 99);
        assert_eq!(n, 99, "ecrire doit modifier la variable");
    }
}
