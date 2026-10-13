#[derive(Debug, PartialEq)]
enum Message {
    Avancer { x: i32, y: i32 },
    Ecrire(String),
    ChangerCouleur(u8, u8, u8),
    Arreter,
}

#[derive(Debug, PartialEq)]
struct Robot {
    position: (i32, i32),
    texte: String,
    couleur: (u8, u8, u8),
    actif: bool,
}

impl Robot {
    fn new() -> Self {
        Self {
            position: (0, 0),
            texte: String::new(),
            couleur: (0, 0, 0),
            actif: true,
        }
    }

    fn traiter(&mut self, message: Message) {
        if !self.actif {
            return;
        }
        match message {
            Message::Avancer { x, y } => {
                self.position.0 += x;
                self.position.1 += y;
            }
            Message::Ecrire(texte) => self.texte.push_str(&texte),
            Message::ChangerCouleur(r, g, b) => self.couleur = (r, g, b),
            Message::Arreter => self.actif = false,
        }
    }
}

fn main() {
    let mut robot = Robot::new();
    robot.traiter(Message::Avancer { x: 2, y: 3 });
    robot.traiter(Message::Ecrire(String::from("Bip")));
    robot.traiter(Message::Arreter);
    println!("{:?}", robot);
}
