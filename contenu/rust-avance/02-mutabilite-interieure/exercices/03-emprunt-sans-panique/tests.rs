#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ajout_quand_libre() {
        let liste = RefCell::new(vec![7]);
        assert!(ajouter_si_libre(&liste, 8), "la liste est libre, l'ajout réussit");
        assert_eq!(*liste.borrow(), vec![7, 8], "la valeur est bien ajoutée");
    }

    #[test]
    fn ajout_refuse_pendant_une_lecture() {
        let liste = RefCell::new(vec![7]);
        let _lecture = liste.borrow();
        assert!(!ajouter_si_libre(&liste, 8), "une lecture est active, l'ajout est refusé");
    }

    #[test]
    fn lecture_du_premier() {
        let liste = RefCell::new(vec![7, 8]);
        assert_eq!(lire_premier(&liste), Some(7), "le premier élément");
        let vide: RefCell<Vec<i32>> = RefCell::new(Vec::new());
        assert_eq!(lire_premier(&vide), None, "liste vide");
    }

    #[test]
    fn lecture_autorisee_pendant_une_lecture() {
        let liste = RefCell::new(vec![7]);
        let _lecture = liste.borrow();
        assert_eq!(lire_premier(&liste), Some(7), "plusieurs lectures en même temps sont permises");
    }

    #[test]
    fn lecture_refusee_pendant_une_ecriture() {
        let liste = RefCell::new(vec![7]);
        let _ecriture = liste.borrow_mut();
        assert_eq!(lire_premier(&liste), None, "une écriture est active, la lecture est refusée");
    }
}
