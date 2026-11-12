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

async fn prix(article: &str) -> u32 {
    match article {
        "pain" => 2,
        "lait" => 1,
        "fromage" => 5,
        _ => 0,
    }
}

async fn total_panier(articles: &[&str]) -> u32 {
    let mut total = 0;
    for article in articles {
        total += prix(article).await;
    }
    total
}

async fn plus_cher(articles: &[&str]) -> u32 {
    let mut meilleur = 0;
    for article in articles {
        let p = prix(article).await;
        if p > meilleur {
            meilleur = p;
        }
    }
    meilleur
}

fn main() {
    let panier = ["pain", "fromage", "lait"];
    println!("total : {}", block_on(total_panier(&panier)));
    println!("plus cher : {}", block_on(plus_cher(&panier)));
}
