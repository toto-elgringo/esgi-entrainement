union Nombre {
    entier: u32,
    flottant: f32,
}

fn bits_du_flottant(f: f32) -> u32 {
    let n = Nombre { flottant: f };
    unsafe { n.entier }
}

#[allow(clippy::missing_safety_doc)]
unsafe trait Brut: Copy {
    fn octet_logique(&self) -> u32;
}

unsafe impl Brut for bool {
    fn octet_logique(&self) -> u32 {
        u32::from(*self)
    }
}

unsafe impl Brut for u32 {
    fn octet_logique(&self) -> u32 {
        *self
    }
}

fn afficher<T: Brut>(libelle: &str, v: T) {
    println!("{} : {}", libelle, v.octet_logique());
}

fn main() {
    println!("{}", bits_du_flottant(1.0));
    afficher("vrai", true);
    afficher("5", 5u32);
}
