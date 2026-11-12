use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

struct PretApres {
    restant: u32,
}

impl PretApres {
    fn new(restant: u32) -> Self {
        PretApres { restant }
    }
}

impl Future for PretApres {
    type Output = &'static str;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        todo!()
    }
}

fn main() {
    let mut futur = Box::pin(PretApres::new(2));
    let mut contexte = Context::from_waker(Waker::noop());
    for i in 1..=3 {
        println!("poll n°{i} : {:?}", futur.as_mut().poll(&mut contexte));
    }
}
