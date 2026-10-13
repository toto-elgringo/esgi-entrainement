#[derive(Debug)]
struct Eleve {
    nom: String,
    note: u32,
}

impl Eleve {
    fn new(nom: &str, note: u32) -> Self {
        Self {
            nom: nom.to_string(),
            note,
        }
    }

    fn presenter(&self) -> String {
        format!("{} a eu {}/20", self.nom, self.note)
    }
}

fn main() {
    let alice = Eleve::new("Alice", 15);
    let bob = Eleve::new("Bob", 9);
    println!("{:?}", alice);
    println!("{:#?}", bob);
    println!("{}", alice.presenter());
    println!("{}", bob.presenter());
}
