struct Celsius(f64);
struct Fahrenheit(f64);

fn vers_fahrenheit(c: Celsius) -> Fahrenheit {
    Fahrenheit(c.0 * 9.0 / 5.0 + 32.0)
}

fn vers_celsius(f: Fahrenheit) -> Celsius {
    Celsius((f.0 - 32.0) * 5.0 / 9.0)
}

fn est_gele(c: &Celsius) -> bool {
    c.0 <= 0.0
}

fn main() {
    let f = vers_fahrenheit(Celsius(100.0));
    println!("100 °C = {} °F", f.0);
}
