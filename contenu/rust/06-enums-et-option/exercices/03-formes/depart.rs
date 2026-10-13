use std::f64::consts::PI;

enum Forme {
    Cercle { rayon: f64 },
    Rectangle { largeur: f64, hauteur: f64 },
    Triangle(f64, f64),
}

impl Forme {
    fn aire(&self) -> f64 {
        todo!()
    }

    fn nom(&self) -> &'static str {
        todo!()
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
