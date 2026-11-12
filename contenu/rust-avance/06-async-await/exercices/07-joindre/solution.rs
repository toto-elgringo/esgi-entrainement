use std::future::Future;
use std::pin::{Pin, pin};
use std::task::{Context, Poll, Waker};

fn block_on<F: Future>(futur: F) -> F::Output {
    let mut futur = pin!(futur);
    let mut contexte = Context::from_waker(Waker::noop());
    loop {
        if let Poll::Ready(valeur) = futur.as_mut().poll(&mut contexte) {
            return valeur;
        }
    }
}

type FuturBoite = Pin<Box<dyn Future<Output = u32>>>;

struct Minuteur {
    restant: u32,
    valeur: u32,
    termine: bool,
}

impl Minuteur {
    fn new(restant: u32, valeur: u32) -> Self {
        Minuteur { restant, valeur, termine: false }
    }
}

impl Future for Minuteur {
    type Output = u32;

    fn poll(mut self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<u32> {
        assert!(!self.termine, "futur interrogé après Ready");
        if self.restant == 0 {
            self.termine = true;
            Poll::Ready(self.valeur)
        } else {
            self.restant -= 1;
            Poll::Pending
        }
    }
}

struct Joindre {
    a: FuturBoite,
    b: FuturBoite,
    resultat_a: Option<u32>,
    resultat_b: Option<u32>,
}

impl Joindre {
    fn new(a: FuturBoite, b: FuturBoite) -> Self {
        Joindre { a, b, resultat_a: None, resultat_b: None }
    }
}

impl Future for Joindre {
    type Output = (u32, u32);

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<(u32, u32)> {
        let this = self.get_mut();
        if this.resultat_a.is_none()
            && let Poll::Ready(v) = this.a.as_mut().poll(cx)
        {
            this.resultat_a = Some(v);
        }
        if this.resultat_b.is_none()
            && let Poll::Ready(v) = this.b.as_mut().poll(cx)
        {
            this.resultat_b = Some(v);
        }
        match (this.resultat_a, this.resultat_b) {
            (Some(a), Some(b)) => Poll::Ready((a, b)),
            _ => Poll::Pending,
        }
    }
}

fn main() {
    let jointure = Joindre::new(Box::pin(Minuteur::new(1, 10)), Box::pin(Minuteur::new(3, 20)));
    println!("{:?}", block_on(jointure));
}
