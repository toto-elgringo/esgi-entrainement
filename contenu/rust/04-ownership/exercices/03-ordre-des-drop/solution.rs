struct Bruyant {
    nom: &'static str,
}

impl Bruyant {
    fn new(nom: &'static str) -> Bruyant {
        println!("création de {nom}");
        Bruyant { nom }
    }
}

impl Drop for Bruyant {
    fn drop(&mut self) {
        println!("drop {}", self.nom);
    }
}

fn main() {
    let _a = Bruyant::new("A");
    {
        let _b = Bruyant::new("B");
    }
    let c = Bruyant::new("C");
    drop(c);
    let _d = Bruyant::new("D");
    println!("fin du main");
}
