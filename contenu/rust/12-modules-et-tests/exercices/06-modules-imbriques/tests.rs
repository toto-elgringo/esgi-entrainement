#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn vers_fahrenheit() {
        assert_eq!(meteo::conversion::celsius_vers_fahrenheit(0.0), 32.0, "0 °C = 32 °F");
        assert_eq!(meteo::conversion::celsius_vers_fahrenheit(100.0), 212.0, "100 °C = 212 °F");
        assert_eq!(meteo::conversion::celsius_vers_fahrenheit(-40.0), -40.0, "-40 °C = -40 °F");
    }

    #[test]
    fn vers_celsius() {
        assert_eq!(meteo::conversion::fahrenheit_vers_celsius(32.0), 0.0, "32 °F = 0 °C");
        assert_eq!(meteo::conversion::fahrenheit_vers_celsius(212.0), 100.0, "212 °F = 100 °C");
        assert_eq!(meteo::conversion::fahrenheit_vers_celsius(-40.0), -40.0, "-40 °F = -40 °C");
    }

    #[test]
    fn niveaux_d_alerte() {
        assert_eq!(niveau(14.0), "gel", "14 °F = -10 °C : gel");
        assert_eq!(niveau(32.0), "normal", "32 °F = 0 °C : normal");
        assert_eq!(niveau(68.0), "normal", "68 °F = 20 °C : normal");
        assert_eq!(niveau(86.0), "chaud", "86 °F = 30 °C : chaud");
        assert_eq!(niveau(95.0), "canicule", "95 °F = 35 °C : canicule");
        assert_eq!(niveau(104.0), "canicule", "104 °F = 40 °C : canicule");
    }
}
