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
        todo!()
    }

    fn traiter(&mut self, message: Message) {
        todo!()
    }
}

fn main() {
    let mut robot = Robot::new();
    robot.traiter(Message::Avancer { x: 2, y: 3 });
    robot.traiter(Message::Ecrire(String::from("Bip")));
    robot.traiter(Message::Arreter);
    println!("{:?}", robot);
}
