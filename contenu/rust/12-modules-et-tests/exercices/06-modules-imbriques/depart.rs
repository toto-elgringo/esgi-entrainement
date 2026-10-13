mod meteo {
    pub mod conversion {
        pub fn celsius_vers_fahrenheit(celsius: f64) -> f64 {
            todo!()
        }

        pub fn fahrenheit_vers_celsius(fahrenheit: f64) -> f64 {
            todo!()
        }
    }

    pub mod alerte {
        pub fn niveau(fahrenheit: f64) -> &'static str {
            todo!()
        }
    }
}

fn main() {
    println!("104 °F : {}", niveau(104.0));
}
