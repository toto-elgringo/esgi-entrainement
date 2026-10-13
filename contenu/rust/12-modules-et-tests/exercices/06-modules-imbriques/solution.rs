mod meteo {
    pub mod conversion {
        pub fn celsius_vers_fahrenheit(celsius: f64) -> f64 {
            celsius * 9.0 / 5.0 + 32.0
        }

        pub fn fahrenheit_vers_celsius(fahrenheit: f64) -> f64 {
            (fahrenheit - 32.0) * 5.0 / 9.0
        }
    }

    pub mod alerte {
        use super::conversion::fahrenheit_vers_celsius;

        pub fn niveau(fahrenheit: f64) -> &'static str {
            let celsius = fahrenheit_vers_celsius(fahrenheit);
            if celsius < 0.0 {
                "gel"
            } else if celsius < 25.0 {
                "normal"
            } else if celsius < 35.0 {
                "chaud"
            } else {
                "canicule"
            }
        }
    }
}

pub use meteo::alerte::niveau;

fn main() {
    println!("104 °F : {}", niveau(104.0));
}
