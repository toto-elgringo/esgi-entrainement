use std::mem::{align_of, offset_of, size_of};

#[repr(C)]
struct Mesure {
    actif: bool,
    horodatage: u64,
    niveau: u8,
    valeur: u32,
    numero: u16,
}

fn main() {
    println!(
        "taille : {} octets, alignement : {}",
        size_of::<Mesure>(),
        align_of::<Mesure>()
    );
    println!("actif      à l'octet {}", offset_of!(Mesure, actif));
    println!("horodatage à l'octet {}", offset_of!(Mesure, horodatage));
    println!("niveau     à l'octet {}", offset_of!(Mesure, niveau));
    println!("valeur     à l'octet {}", offset_of!(Mesure, valeur));
    println!("numero     à l'octet {}", offset_of!(Mesure, numero));
}
