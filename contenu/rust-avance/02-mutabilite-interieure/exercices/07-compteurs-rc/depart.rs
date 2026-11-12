use std::rc::Rc;

fn comptes<T>(rc: &Rc<T>) -> (usize, usize) {
    todo!()
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
