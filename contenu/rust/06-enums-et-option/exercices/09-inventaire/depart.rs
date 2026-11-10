enum Potion {
    Soin(u8),
    Force(i8),
}

enum Arme {
    Epee { degats: u8 },
    Hache { degats: u8 },
    Arc { degats: u8, portee: u32 },
}

enum Objet {
    Rien,
    Arme(Arme),
    Armure { defense: u8 },
    Potion(Potion),
}

fn degats(objet: &Objet) -> u8 {
    todo!()
}

fn portee(objet: &Objet) -> Option<u32> {
    todo!()
}

fn decrire(objet: &Objet) -> String {
    todo!()
}

fn main() {
    let sac = [
        Objet::Arme(Arme::Arc { degats: 7, portee: 40 }),
        Objet::Arme(Arme::Epee { degats: 9 }),
        Objet::Armure { defense: 3 },
        Objet::Potion(Potion::Force(-2)),
        Objet::Rien,
    ];
    for objet in &sac {
        println!("{} | dégâts {} | portée {:?}", decrire(objet), degats(objet), portee(objet));
    }
}
