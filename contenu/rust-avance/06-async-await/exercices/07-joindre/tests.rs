#[cfg(test)]
mod tests {
    use super::*;
    use std::task::{Context, Poll, Waker};

    #[test]
    fn deux_futurs_de_duree_differente() {
        let jointure = Joindre::new(Box::pin(Minuteur::new(1, 10)), Box::pin(Minuteur::new(3, 20)));
        assert_eq!(block_on(jointure), (10, 20), "résultats des deux futurs, dans l'ordre a puis b");
    }

    #[test]
    fn nombre_de_polls() {
        let mut jointure = Box::pin(Joindre::new(Box::pin(Minuteur::new(0, 7)), Box::pin(Minuteur::new(2, 8))));
        let mut contexte = Context::from_waker(Waker::noop());
        assert_eq!(jointure.as_mut().poll(&mut contexte), Poll::Pending, "1er poll : b n'a pas fini");
        assert_eq!(jointure.as_mut().poll(&mut contexte), Poll::Pending, "2e poll : b n'a pas fini");
        assert_eq!(jointure.as_mut().poll(&mut contexte), Poll::Ready((7, 8)), "3e poll : tout est prêt");
    }

    #[test]
    fn tout_de_suite() {
        let mut jointure = Box::pin(Joindre::new(Box::pin(Minuteur::new(0, 1)), Box::pin(Minuteur::new(0, 2))));
        let mut contexte = Context::from_waker(Waker::noop());
        assert_eq!(jointure.as_mut().poll(&mut contexte), Poll::Ready((1, 2)), "deux futurs déjà prêts");
    }

    #[test]
    fn a_plus_long_que_b() {
        let jointure = Joindre::new(Box::pin(Minuteur::new(4, 1)), Box::pin(Minuteur::new(0, 2)));
        assert_eq!(block_on(jointure), (1, 2), "b finit en premier : il ne doit pas être interrogé de nouveau");
    }

    #[test]
    fn dans_un_bloc_async() {
        let somme = block_on(async {
            let (a, b) = Joindre::new(Box::pin(Minuteur::new(2, 30)), Box::pin(Minuteur::new(1, 12))).await;
            a + b
        });
        assert_eq!(somme, 42, "join utilisé avec .await");
    }
}
