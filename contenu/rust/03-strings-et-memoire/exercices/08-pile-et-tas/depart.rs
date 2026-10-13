fn main() {
    let sur_la_pile: u64 = 42;
    let sur_le_tas: Box<u64> = Box::new(42);

    println!("pile : {sur_la_pile}");
    println!("tas : {sur_le_tas}");
    println!("somme : {}", sur_la_pile + sur_le_tas);
    println!("taille d'une Box : {} octets", std::mem::size_of::<Box<u64>>());
}
