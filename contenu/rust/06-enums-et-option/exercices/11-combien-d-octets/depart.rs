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

const POTION: usize = 0;
const ARME: usize = 0;
const OBJET: usize = 0;
const OPTION_U8: usize = 0;
const OPTION_U32: usize = 0;
const OPTION_NON_NUL: usize = 0;
const OPTION_REFERENCE: usize = 0;
const OPTION_BOOL: usize = 0;

fn main() {
    let predictions = [
        ("Potion", POTION),
        ("Arme", ARME),
        ("Objet", OBJET),
        ("Option<u8>", OPTION_U8),
        ("Option<u32>", OPTION_U32),
        ("Option<NonZeroU32>", OPTION_NON_NUL),
        ("Option<&u8>", OPTION_REFERENCE),
        ("Option<bool>", OPTION_BOOL),
    ];
    for (nom, taille) in predictions {
        println!("{nom} : {taille} octet(s) prédit(s)");
    }
}
