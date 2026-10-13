trait Animal {
    fn nom(&self) -> String;
    fn espece(&self) -> String;
    fn cri(&self) -> String;

    fn presenter(&self) -> String {
        format!("{} le {} dit {}", self.nom(), self.espece(), self.cri())
    }
}

struct Chien {
    nom: String,
}

struct Chat {
    nom: String,
}

struct Perroquet {
    nom: String,
    mot: String,
}

impl Animal for Chien {
    fn nom(&self) -> String {
        self.nom.clone()
    }

    fn espece(&self) -> String {
        "chien".to_string()
    }

    fn cri(&self) -> String {
        "Wouf".to_string()
    }
}

impl Animal for Chat {
    fn nom(&self) -> String {
        self.nom.clone()
    }

    fn espece(&self) -> String {
        "chat".to_string()
    }

    fn cri(&self) -> String {
        "Miaou".to_string()
    }
}

fn main() {
    let bestiaire: Vec<Box<dyn Animal>> = vec![
        Box::new(Chien { nom: "Rex".to_string() }),
        Box::new(Chat { nom: "Felix".to_string() }),
    ];

    for animal in &bestiaire {
        println!("{}", animal.presenter());
    }
    println!("{} animaux dans le bestiaire", bestiaire.len());
}
