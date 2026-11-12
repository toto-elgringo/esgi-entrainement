use std::future::Future;
use std::pin::pin;
use std::task::{Context, Poll, Waker};

fn block_on<F: Future>(futur: F) -> F::Output {
    todo!()
}

fn main() {
    let somme = block_on(async { 20 + 22 });
    println!("{somme}");
}
