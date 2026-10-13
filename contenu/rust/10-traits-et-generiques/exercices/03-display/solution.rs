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
        if self.denominateur == 1 {
            write!(f, "{}", self.numerateur)
        } else {
            write!(f, "{}/{}", self.numerateur, self.denominateur)
        }
    }
}

impl fmt::Display for Temperature {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:.1} °C", self.celsius)
    }
}

fn main() {
    println!("{}", Fraction { numerateur: 3, denominateur: 4 });
    println!("Il fait {}", Temperature { celsius: 21.456 });
}
