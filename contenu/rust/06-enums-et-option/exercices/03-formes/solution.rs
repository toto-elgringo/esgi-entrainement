use std::f64::consts::PI;

enum Forme {
    Cercle { rayon: f64 },
    Rectangle { largeur: f64, hauteur: f64 },
    Triangle(f64, f64),
}

impl Forme {
    fn aire(&self) -> f64 {
        match self {
            Forme::Cercle { rayon } => PI * rayon * rayon,
            Forme::Rectangle { largeur, hauteur } => largeur * hauteur,
            Forme::Triangle(base, hauteur) => base * hauteur / 2.0,
        }
    }

    fn nom(&self) -> &'static str {
        match self {
            Forme::Cercle { .. } => "cercle",
            Forme::Rectangle { .. } => "rectangle",
            Forme::Triangle(..) => "triangle",
        }
    }
}

fn main() {
    let formes = [
        Forme::Cercle { rayon: 1.0 },
        Forme::Rectangle { largeur: 3.0, hauteur: 4.0 },
        Forme::Triangle(6.0, 4.0),
    ];
    for forme in &formes {
        println!("{} : {:.2}", forme.nom(), forme.aire());
    }
}
