use std::cell::RefCell;

fn ajouter_si_libre(liste: &RefCell<Vec<i32>>, valeur: i32) -> bool {
    todo!()
}

fn lire_premier(liste: &RefCell<Vec<i32>>) -> Option<i32> {
    todo!()
}

fn main() {
    let liste = RefCell::new(vec![7]);
    println!("ajout libre : {}", ajouter_si_libre(&liste, 8));

    let lecture = liste.borrow();
    println!("ajout pendant une lecture : {}", ajouter_si_libre(&liste, 9));
    println!("premier : {:?}", lire_premier(&liste));
    drop(lecture);

    println!("contenu : {:?}", liste.borrow());
}
