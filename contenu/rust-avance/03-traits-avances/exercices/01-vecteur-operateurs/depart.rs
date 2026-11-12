use std::ops::{Add, Mul, Neg, Sub};

#[derive(Debug, Clone, Copy, PartialEq)]
struct Vecteur {
    x: f64,
    y: f64,
}

impl Add for Vecteur {
    type Output = Vecteur;

    fn add(self, autre: Vecteur) -> Vecteur {
        todo!()
    }
}

impl Sub for Vecteur {
    type Output = Vecteur;

    fn sub(self, autre: Vecteur) -> Vecteur {
        todo!()
    }
}

impl Neg for Vecteur {
    type Output = Vecteur;

    fn neg(self) -> Vecteur {
        todo!()
    }
}

impl Mul<f64> for Vecteur {
    type Output = Vecteur;

    fn mul(self, k: f64) -> Vecteur {
        todo!()
    }
}

fn main() {
    let a = Vecteur { x: 1.5, y: 2.0 };
    let b = Vecteur { x: 3.0, y: 4.0 };
    println!("{:?}", a + b);
    println!("{:?}", b - a);
    println!("{:?}", -a);
    println!("{:?}", a * 2.0);
}
