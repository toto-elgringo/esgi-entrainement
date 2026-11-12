use std::fmt;
use std::ops::Add;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Metres(f64);

#[derive(Debug, Clone, Copy, PartialEq)]
struct Kilometres(f64);

impl From<Kilometres> for Metres {
    fn from(km: Kilometres) -> Metres {
        Metres(km.0 * 1000.0)
    }
}

impl From<Metres> for Kilometres {
    fn from(m: Metres) -> Kilometres {
        Kilometres(m.0 / 1000.0)
    }
}

impl Add for Metres {
    type Output = Metres;

    fn add(self, autre: Metres) -> Metres {
        Metres(self.0 + autre.0)
    }
}

impl fmt::Display for Metres {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} m", self.0)
    }
}

impl fmt::Display for Kilometres {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} km", self.0)
    }
}

fn distance_totale(etapes: &[Metres]) -> Metres {
    etapes.iter().fold(Metres(0.0), |total, etape| total + *etape)
}

fn main() {
    let etapes = [Metres(800.0), Metres::from(Kilometres(1.5)), Metres(200.0)];
    let total = distance_totale(&etapes);
    println!("{total}");
    println!("{}", Kilometres::from(total));
}
