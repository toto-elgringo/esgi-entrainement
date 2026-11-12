#[cfg(test)]
mod tests {
    use super::*;

    fn base() -> Rc<ListeRc> {
        Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Vide)))))
    }

    #[test]
    fn la_somme() {
        assert_eq!(somme(&base()), 15, "5 + 10");
        assert_eq!(somme(&Vide), 0, "liste vide : 0");
    }

    #[test]
    fn prolonger_la_liste() {
        let a = base();
        let b = prolonger(3, &a);
        assert_eq!(somme(&b), 18, "3 + 5 + 10");
        assert_eq!(somme(&a), 15, "a n'a pas changé");
    }

    #[test]
    fn compteur() {
        let a = base();
        assert_eq!(nombre_de_liens(&a), 1, "un seul propriétaire au début");
        let b = prolonger(3, &a);
        assert_eq!(nombre_de_liens(&a), 2, "b partage a");
        let c = prolonger(4, &a);
        assert_eq!(nombre_de_liens(&a), 3, "c partage aussi a");
        assert_eq!(nombre_de_liens(&c), 1, "c n'a qu'un propriétaire");
        drop(c);
        assert_eq!(nombre_de_liens(&a), 2, "c est libérée : le compteur redescend");
        drop(b);
        assert_eq!(nombre_de_liens(&a), 1, "il ne reste que a");
    }

    #[test]
    fn partage_sans_copie() {
        let a = base();
        let b = prolonger(1, &a);
        match &*b {
            Cons(_, suite) => assert!(Rc::ptr_eq(suite, &a), "la suite de b est exactement a, pas une copie"),
            Vide => panic!("b ne doit pas être vide"),
        }
    }
}
