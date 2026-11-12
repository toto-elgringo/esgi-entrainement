use std::ops::{Add, Mul, Neg, Sub};

#[derive(Debug, Clone, Copy, PartialEq)]
struct Vecteur {
    x: f64,
    y: f64,
}

impl Add for Vecteur {
    type Output = Vecteur;

    fn add(self, autre: Vecteur) -> Vecteur {
        Vecteur { x: self.x + autre.x, y: self.y + autre.y }
    }
}

impl Sub for Vecteur {
    type Output = Vecteur;

    fn sub(self, autre: Vecteur) -> Vecteur {
        Vecteur { x: self.x - autre.x, y: self.y - autre.y }
    }
}

impl Neg for Vecteur {
    type Output = Vecteur;

    fn neg(self) -> Vecteur {
        Vecteur { x: -self.x, y: -self.y }
    }
}

impl Mul<f64> for Vecteur {
    type Output = Vecteur;

    fn mul(self, k: f64) -> Vecteur {
        Vecteur { x: self.x * k, y: self.y * k }
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
