use std::cell::RefCell;
use std::rc::Rc;

fn deposer(solde: &Rc<RefCell<i32>>, montant: i32) {
    *solde.borrow_mut() += montant;
}

fn retirer(solde: &Rc<RefCell<i32>>, montant: i32) -> Result<(), String> {
    let actuel = *solde.borrow();
    if actuel < montant {
        return Err("solde insuffisant".to_string());
    }
    *solde.borrow_mut() -= montant;
    Ok(())
}

fn virement(source: &Rc<RefCell<i32>>, cible: &Rc<RefCell<i32>>, montant: i32) -> Result<(), String> {
    retirer(source, montant)?;
    deposer(cible, montant);
    Ok(())
}

fn main() {
    let compte = Rc::new(RefCell::new(100));
    let carte = Rc::clone(&compte);

    deposer(&carte, 50);
    println!("solde : {}", compte.borrow());
    println!("{:?}", retirer(&compte, 500));

    let epargne = Rc::new(RefCell::new(0));
    println!("{:?}", virement(&compte, &epargne, 40));
    println!("compte : {}, épargne : {}", compte.borrow(), epargne.borrow());
}
