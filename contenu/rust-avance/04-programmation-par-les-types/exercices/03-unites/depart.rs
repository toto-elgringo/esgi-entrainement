use std::fmt;
use std::ops::Add;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Metres(f64);

#[derive(Debug, Clone, Copy, PartialEq)]
struct Kilometres(f64);

impl From<Kilometres> for Metres {
    fn from(km: Kilometres) -> Metres {
        todo!()
    }
}

impl From<Metres> for Kilometres {
    fn from(m: Metres) -> Kilometres {
        todo!()
    }
}

impl Add for Metres {
    type Output = Metres;

    fn add(self, autre: Metres) -> Metres {
        todo!()
    }
}

impl fmt::Display for Metres {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}

impl fmt::Display for Kilometres {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}

fn distance_totale(etapes: &[Metres]) -> Metres {
    todo!()
}

fn main() {
    let etapes = [Metres(800.0), Metres::from(Kilometres(1.5)), Metres(200.0)];
    let total = distance_totale(&etapes);
    println!("{total}");
    println!("{}", Kilometres::from(total));
}
