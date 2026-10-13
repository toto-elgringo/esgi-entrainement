#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn aires() {
        assert_eq!(geometrie::aire_rectangle(3, 4), 12, "3 × 4 = 12");
        assert_eq!(geometrie::aire_rectangle(0, 5), 0, "une largeur nulle donne une aire nulle");
    }

    #[test]
    fn perimetres() {
        assert_eq!(geometrie::perimetre_rectangle(3, 4), 14, "2 × (3 + 4) = 14");
        assert_eq!(geometrie::perimetre_rectangle(1, 1), 4, "un carré de côté 1 a un périmètre de 4");
    }
}
