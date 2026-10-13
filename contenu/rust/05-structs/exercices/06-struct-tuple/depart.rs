struct Celsius(f64);
struct Fahrenheit(f64);

fn vers_fahrenheit(c: Celsius) -> Fahrenheit {
    todo!()
}

fn vers_celsius(f: Fahrenheit) -> Celsius {
    todo!()
}

fn est_gele(c: &Celsius) -> bool {
    todo!()
}

fn main() {
    let f = vers_fahrenheit(Celsius(100.0));
    println!("100 °C = {} °F", f.0);
}
