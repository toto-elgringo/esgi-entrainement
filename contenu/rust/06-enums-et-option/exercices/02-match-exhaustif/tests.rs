#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn tourner() {
        assert_eq!(tourner_a_droite(Direction::Nord), Direction::Est, "Nord → Est");
        assert_eq!(tourner_a_droite(Direction::Est), Direction::Sud, "Est → Sud");
        assert_eq!(tourner_a_droite(Direction::Sud), Direction::Ouest, "Sud → Ouest");
        assert_eq!(tourner_a_droite(Direction::Ouest), Direction::Nord, "Ouest → Nord");
    }

    #[test]
    fn degres() {
        assert_eq!(en_degres(&Direction::Nord), 0, "Nord = 0°");
        assert_eq!(en_degres(&Direction::Est), 90, "Est = 90°");
        assert_eq!(en_degres(&Direction::Sud), 180, "Sud = 180°");
        assert_eq!(en_degres(&Direction::Ouest), 270, "Ouest = 270°");
    }
}
