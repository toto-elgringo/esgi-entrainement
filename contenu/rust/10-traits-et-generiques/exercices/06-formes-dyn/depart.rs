use std::f64::consts::PI;

trait Forme {
    fn aire(&self) -> f64;
    fn nom(&self) -> String;
}

struct Rectangle {
    largeur: f64,
    hauteur: f64,
}

struct Cercle {
    rayon: f64,
}

impl Forme for Rectangle {
    fn aire(&self) -> f64 {
        todo!()
    }

    fn nom(&self) -> String {
        "rectangle".to_string()
    }
}

impl Forme for Cercle {
    fn aire(&self) -> f64 {
        todo!()
    }

    fn nom(&self) -> String {
        "cercle".to_string()
    }
}

fn aire_totale(formes: &[Box<dyn Forme>]) -> f64 {
    todo!()
}

fn nom_de_la_plus_grande(formes: &[Box<dyn Forme>]) -> Option<String> {
    todo!()
}

fn main() {
    let formes: Vec<Box<dyn Forme>> = vec![
        Box::new(Rectangle { largeur: 2.0, hauteur: 1.0 }),
        Box::new(Cercle { rayon: 1.0 }),
    ];
    println!("Aire totale : {}", aire_totale(&formes));
    println!("La plus grande : {:?}", nom_de_la_plus_grande(&formes));
}
