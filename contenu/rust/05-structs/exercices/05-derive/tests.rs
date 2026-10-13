#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn affichage() {
        assert_eq!(
            format!("{:?}", Point { x: 1, y: 2 }),
            "Point { x: 1, y: 2 }",
            "{{:?}} doit afficher le nom et les champs"
        );
    }

    #[test]
    fn copie() {
        let point = Point { x: 4, y: 5 };
        let copie = point.clone();
        assert_eq!(point, copie, "la copie doit être égale à l'original");
    }

    #[test]
    fn deplacement() {
        let depart = Point { x: 0, y: 0 };
        assert_eq!(deplacer(&depart, 3, -2), Point { x: 3, y: -2 }, "(0, 0) déplacé de (3, -2) donne (3, -2)");
        assert_ne!(deplacer(&depart, 1, 0), depart, "un point déplacé n'est plus le même");
    }
}
