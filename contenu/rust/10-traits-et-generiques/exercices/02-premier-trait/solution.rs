trait Vehicule {
    fn nom(&self) -> String;
    fn roues(&self) -> u32;
    fn presenter(&self) -> String {
        format!("{} : {} roues", self.nom(), self.roues())
    }
}

struct Voiture {
    marque: String,
}

struct Velo;

impl Vehicule for Voiture {
    fn nom(&self) -> String {
        self.marque.clone()
    }

    fn roues(&self) -> u32 {
        4
    }
}

impl Vehicule for Velo {
    fn nom(&self) -> String {
        "Vélo".to_string()
    }

    fn roues(&self) -> u32 {
        2
    }

    fn presenter(&self) -> String {
        format!("{} : {} roues, sans moteur", self.nom(), self.roues())
    }
}

fn main() {
    let voiture = Voiture { marque: "Renault".to_string() };
    println!("{}", voiture.presenter());
    println!("{}", Velo.presenter());
}
