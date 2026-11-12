#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn depot_visible_par_tous_les_proprietaires() {
        let compte = Rc::new(RefCell::new(100));
        let carte = Rc::clone(&compte);
        deposer(&carte, 50);
        assert_eq!(*compte.borrow(), 150, "le dépôt fait via la carte se voit sur le compte");
    }

    #[test]
    fn retrait_possible() {
        let compte = Rc::new(RefCell::new(100));
        assert_eq!(retirer(&compte, 30), Ok(()), "le retrait réussit");
        assert_eq!(*compte.borrow(), 70, "le solde baisse");
    }

    #[test]
    fn retrait_impossible() {
        let compte = Rc::new(RefCell::new(100));
        assert_eq!(retirer(&compte, 150), Err("solde insuffisant".to_string()), "pas assez d'argent");
        assert_eq!(*compte.borrow(), 100, "le solde ne change pas");
    }

    #[test]
    fn virement_reussi() {
        let a = Rc::new(RefCell::new(100));
        let b = Rc::new(RefCell::new(100));
        assert_eq!(virement(&a, &b, 40), Ok(()), "le virement réussit");
        assert_eq!((*a.borrow(), *b.borrow()), (60, 140), "les deux soldes changent");
    }

    #[test]
    fn virement_refuse() {
        let a = Rc::new(RefCell::new(10));
        let b = Rc::new(RefCell::new(0));
        assert_eq!(virement(&a, &b, 40), Err("solde insuffisant".to_string()), "virement trop gros");
        assert_eq!((*a.borrow(), *b.borrow()), (10, 0), "rien ne change");
    }
}
