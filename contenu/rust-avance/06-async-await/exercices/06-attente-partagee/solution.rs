use std::cell::RefCell;
use std::future::Future;
use std::pin::{Pin, pin};
use std::rc::Rc;
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

type Boite = Rc<RefCell<Option<i32>>>;

struct Attente {
    boite: Boite,
}

impl Future for Attente {
    type Output = i32;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<i32> {
        let valeur = self.boite.borrow_mut().take();
        match valeur {
            Some(v) => Poll::Ready(v),
            None => {
                cx.waker().wake_by_ref();
                Poll::Pending
            }
        }
    }
}

async fn doubler(attente: Attente) -> i32 {
    attente.await * 2
}

fn main() {
    let boite: Boite = Rc::new(RefCell::new(Some(21)));
    let resultat = block_on(doubler(Attente { boite }));
    println!("{resultat}");
}
