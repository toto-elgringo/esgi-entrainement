use std::future::Future;
use std::pin::pin;
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

async fn saluer(nom: &str) -> String {
    println!("préparation de {nom}");
    format!("Bonjour {nom}")
}

fn main() {
    let futur = saluer("Ada");
    println!("futur créé");
    let message = block_on(futur);
    println!("{message}");

    let double = async {
        println!("bloc async lancé");
        2 * 21
    };
    println!("bloc créé");
    let reponse = block_on(double);
    println!("réponse : {reponse}");
}
