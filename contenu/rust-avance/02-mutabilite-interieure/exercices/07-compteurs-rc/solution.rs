use std::rc::Rc;

fn comptes<T>(rc: &Rc<T>) -> (usize, usize) {
    (Rc::strong_count(rc), Rc::weak_count(rc))
}

fn main() {
    let a = Rc::new(5);
    let (forts, faibles) = comptes(&a);
    println!("forts : {forts}, faibles : {faibles}");

    let b = Rc::clone(&a);
    let faible = Rc::downgrade(&a);
    let (forts, faibles) = comptes(&a);
    println!("forts : {forts}, faibles : {faibles}");

    drop(b);
    let (forts, faibles) = comptes(&a);
    println!("forts : {forts}, faibles : {faibles}");

    println!("valeur : {:?}", faible.upgrade());

    drop(a);
    println!("valeur : {:?}", faible.upgrade());
}
