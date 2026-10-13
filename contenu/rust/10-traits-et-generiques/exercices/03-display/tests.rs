#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fraction_classique() {
        let f = Fraction { numerateur: 3, denominateur: 4 };
        assert_eq!(format!("{}", f), "3/4", "3 sur 4 s'affiche 3/4");
        assert_eq!(f.to_string(), "3/4", "to_string() est offert par Display");
    }

    #[test]
    fn fraction_entiere() {
        let f = Fraction { numerateur: 5, denominateur: 1 };
        assert_eq!(f.to_string(), "5", "5 sur 1 s'affiche simplement 5");
    }

    #[test]
    fn temperature_arrondie() {
        let t = Temperature { celsius: 21.456 };
        assert_eq!(t.to_string(), "21.5 °C", "21,456 °C s'affiche avec un chiffre après la virgule");
        assert_eq!(format!("Il fait {}", t), "Il fait 21.5 °C", "Display marche dans format!");
    }

    #[test]
    fn temperature_negative() {
        assert_eq!(Temperature { celsius: -3.0 }.to_string(), "-3.0 °C", "-3 °C s'affiche -3.0 °C");
    }
}
