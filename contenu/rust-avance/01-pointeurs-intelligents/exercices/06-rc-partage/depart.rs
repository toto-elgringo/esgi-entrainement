use std::rc::Rc;
use ListeRc::{Cons, Vide};

enum ListeRc {
    Cons(i32, Rc<ListeRc>),
    Vide,
}

fn somme(liste: &ListeRc) -> i32 {
    todo!()
}

fn prolonger(valeur: i32, suite: &Rc<ListeRc>) -> Rc<ListeRc> {
    todo!()
}

fn nombre_de_liens(liste: &Rc<ListeRc>) -> usize {
    todo!()
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
