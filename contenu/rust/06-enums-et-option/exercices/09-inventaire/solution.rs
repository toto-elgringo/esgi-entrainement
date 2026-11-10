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
    match objet {
        Objet::Arme(Arme::Epee { degats } | Arme::Hache { degats } | Arme::Arc { degats, .. }) => {
            *degats
        }
        Objet::Rien | Objet::Armure { .. } | Objet::Potion(_) => 0,
    }
}

fn portee(objet: &Objet) -> Option<u32> {
    match objet {
        Objet::Arme(Arme::Arc { portee, .. }) => Some(*portee),
        _ => None,
    }
}

fn decrire(objet: &Objet) -> String {
    match objet {
        Objet::Rien => "rien".to_string(),
        Objet::Armure { defense } => format!("armure ({defense} de défense)"),
        Objet::Arme(Arme::Arc { degats, portee }) => format!("arc : {degats} dégâts à {portee} m"),
        Objet::Arme(Arme::Epee { .. } | Arme::Hache { .. }) => "arme de corps à corps".to_string(),
        Objet::Potion(Potion::Soin(points)) => format!("potion de soin (+{points})"),
        Objet::Potion(Potion::Force(bonus)) => format!("potion de force ({bonus:+})"),
    }
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
