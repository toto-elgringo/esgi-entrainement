use std::rc::Rc;
use ListeRc::{Cons, Vide};

enum ListeRc {
    Cons(i32, Rc<ListeRc>),
    Vide,
}

fn somme(liste: &ListeRc) -> i32 {
    match liste {
        Vide => 0,
        Cons(valeur, suite) => valeur + somme(suite),
    }
}

fn prolonger(valeur: i32, suite: &Rc<ListeRc>) -> Rc<ListeRc> {
    Rc::new(Cons(valeur, Rc::clone(suite)))
}

fn nombre_de_liens(liste: &Rc<ListeRc>) -> usize {
    Rc::strong_count(liste)
}

fn main() {
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Vide)))));
    println!("liens de a : {}", nombre_de_liens(&a));
    let b = prolonger(3, &a);
    println!("liens de a : {}", nombre_de_liens(&a));
    {
        let c = prolonger(4, &a);
        println!("liens de a : {}", nombre_de_liens(&a));
        println!("somme de c : {}", somme(&c));
    }
    println!("liens de a : {}", nombre_de_liens(&a));
    println!("somme de b : {}", somme(&b));
}
