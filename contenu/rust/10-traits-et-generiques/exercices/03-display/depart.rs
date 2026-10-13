use std::fmt;

struct Fraction {
    numerateur: i32,
    denominateur: i32,
}

struct Temperature {
    celsius: f64,
}

impl fmt::Display for Fraction {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        todo!()
    }
}

impl fmt::Display for Temperature {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        todo!()
    }
}

fn main() {
    println!("{}", Fraction { numerateur: 3, denominateur: 4 });
    println!("Il fait {}", Temperature { celsius: 21.456 });
}
