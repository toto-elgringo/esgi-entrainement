#[cfg(test)]
mod tests {
    use super::*;
    use std::task::{Context, Poll, Waker};

    #[test]
    fn attente_vide_puis_remplie() {
        let boite: Boite = Rc::new(RefCell::new(None));
        let mut futur = Box::pin(Attente { boite: boite.clone() });
        let mut contexte = Context::from_waker(Waker::noop());
        assert_eq!(futur.as_mut().poll(&mut contexte), Poll::Pending, "boîte vide : Pending");
        *boite.borrow_mut() = Some(42);
        assert_eq!(futur.as_mut().poll(&mut contexte), Poll::Ready(42), "boîte remplie : Ready(42)");
        assert!(boite.borrow().is_none(), "la valeur doit être retirée de la boîte");
    }

    #[test]
    fn attente_deja_remplie() {
        let boite: Boite = Rc::new(RefCell::new(Some(7)));
        let mut futur = Box::pin(Attente { boite });
        let mut contexte = Context::from_waker(Waker::noop());
        assert_eq!(futur.as_mut().poll(&mut contexte), Poll::Ready(7), "boîte déjà remplie");
    }

    #[test]
    fn doubler_attend_la_valeur() {
        let boite: Boite = Rc::new(RefCell::new(None));
        let mut futur = Box::pin(doubler(Attente { boite: boite.clone() }));
        let mut contexte = Context::from_waker(Waker::noop());
        assert_eq!(futur.as_mut().poll(&mut contexte), Poll::Pending, "rien à doubler tant que la boîte est vide");
        *boite.borrow_mut() = Some(21);
        assert_eq!(futur.as_mut().poll(&mut contexte), Poll::Ready(42), "21 doublé");
    }

    #[test]
    fn doubler_avec_block_on() {
        let boite: Boite = Rc::new(RefCell::new(Some(5)));
        assert_eq!(block_on(doubler(Attente { boite })), 10, "doubler avec une valeur déjà là");
    }
}
