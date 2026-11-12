static mut COMPTEUR: u32 = 0;

fn suivant() -> u32 {
    unsafe {
        COMPTEUR += 1;
        COMPTEUR
    }
}

fn main() {
    println!("{}", suivant());
    println!("{}", suivant());
}
