use Liste::{Cons, Vide};

enum Liste {
    Cons(i32, Box<Liste>),
    Vide,
}

fn somme(liste: &Liste) -> i32 {
    todo!()
}

fn longueur(liste: &Liste) -> usize {
    todo!()
}

fn contient(liste: &Liste, cherche: i32) -> bool {
    todo!()
}

fn depuis_tranche(valeurs: &[i32]) -> Liste {
    todo!()
}

fn main() {
    let liste = depuis_tranche(&[4, 8, 15, 16]);
    println!("somme : {}", somme(&liste));
    println!("longueur : {}", longueur(&liste));
    println!("contient 15 : {}", contient(&liste, 15));
}
