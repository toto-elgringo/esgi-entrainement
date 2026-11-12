use Liste::{Cons, Vide};

enum Liste {
    Cons(i32, Box<Liste>),
    Vide,
}

fn somme(liste: &Liste) -> i32 {
    match liste {
        Vide => 0,
        Cons(valeur, suite) => valeur + somme(suite),
    }
}

fn longueur(liste: &Liste) -> usize {
    match liste {
        Vide => 0,
        Cons(_, suite) => 1 + longueur(suite),
    }
}

fn contient(liste: &Liste, cherche: i32) -> bool {
    match liste {
        Vide => false,
        Cons(valeur, suite) => *valeur == cherche || contient(suite, cherche),
    }
}

fn depuis_tranche(valeurs: &[i32]) -> Liste {
    valeurs
        .iter()
        .rev()
        .fold(Vide, |reste, &valeur| Cons(valeur, Box::new(reste)))
}

fn main() {
    let liste = depuis_tranche(&[4, 8, 15, 16]);
    println!("somme : {}", somme(&liste));
    println!("longueur : {}", longueur(&liste));
    println!("contient 15 : {}", contient(&liste, 15));
}
