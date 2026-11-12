#[cfg(test)]
mod tests {
    use super::*;
    use std::future::Future;
    use std::task::{Context, Poll, Waker};

    #[test]
    fn pret_au_troisieme_poll() {
        let mut futur = Box::pin(PretApres::new(2));
        let mut contexte = Context::from_waker(Waker::noop());
        assert_eq!(futur.as_mut().poll(&mut contexte), Poll::Pending, "1er poll");
        assert_eq!(futur.as_mut().poll(&mut contexte), Poll::Pending, "2e poll");
        assert_eq!(futur.as_mut().poll(&mut contexte), Poll::Ready("prêt"), "3e poll");
    }

    #[test]
    fn pret_tout_de_suite() {
        let mut futur = Box::pin(PretApres::new(0));
        let mut contexte = Context::from_waker(Waker::noop());
        assert_eq!(futur.as_mut().poll(&mut contexte), Poll::Ready("prêt"), "PretApres::new(0) est prêt au 1er poll");
    }

    #[test]
    fn pret_apres_cinq() {
        let mut futur = Box::pin(PretApres::new(5));
        let mut contexte = Context::from_waker(Waker::noop());
        for numero in 1..=5 {
            assert_eq!(futur.as_mut().poll(&mut contexte), Poll::Pending, "poll n°{numero}");
        }
        assert_eq!(futur.as_mut().poll(&mut contexte), Poll::Ready("prêt"), "6e poll");
    }

    #[test]
    fn avec_await() {
        let mut futur = Box::pin(async { PretApres::new(3).await.chars().count() });
        let mut contexte = Context::from_waker(Waker::noop());
        let mut polls = 0;
        loop {
            polls += 1;
            if let Poll::Ready(longueur) = futur.as_mut().poll(&mut contexte) {
                assert_eq!(longueur, 4, "la longueur de \"prêt\"");
                break;
            }
        }
        assert_eq!(polls, 4, "3 Pending puis 1 Ready");
    }
}
