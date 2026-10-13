#[cfg(test)]
mod tests {
    use super::*;

    fn proche(a: f64, b: f64) -> bool {
        (a - b).abs() < 1e-9
    }

    #[test]
    fn celsius_vers_fahrenheit() {
        assert!(proche(vers_fahrenheit(Celsius(100.0)).0, 212.0), "100 °C = 212 °F");
        assert!(proche(vers_fahrenheit(Celsius(0.0)).0, 32.0), "0 °C = 32 °F");
        assert!(proche(vers_fahrenheit(Celsius(-40.0)).0, -40.0), "-40 °C = -40 °F");
    }

    #[test]
    fn fahrenheit_vers_celsius() {
        assert!(proche(vers_celsius(Fahrenheit(212.0)).0, 100.0), "212 °F = 100 °C");
        assert!(proche(vers_celsius(Fahrenheit(32.0)).0, 0.0), "32 °F = 0 °C");
        assert!(proche(vers_celsius(Fahrenheit(-40.0)).0, -40.0), "-40 °F = -40 °C");
    }

    #[test]
    fn gel() {
        assert!(est_gele(&Celsius(-5.0)), "-5 °C : ça gèle");
        assert!(est_gele(&Celsius(0.0)), "0 °C : ça gèle");
        assert!(!est_gele(&Celsius(3.0)), "3 °C : ça ne gèle pas");
    }
}
