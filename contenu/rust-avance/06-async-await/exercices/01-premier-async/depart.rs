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

async fn addition(a: u32, b: u32) -> u32 {
    a + b
}

async fn formule() -> &'static str {
    "Bonjour"
}

async fn double_somme(a: u32, b: u32) -> u32 {
    todo!()
}

async fn bonjour(nom: &str) -> String {
    todo!()
}

fn main() {
    println!("{}", block_on(double_somme(2, 3)));
    println!("{}", block_on(bonjour("Ada")));
}
