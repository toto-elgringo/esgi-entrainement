use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll, Waker};

type TacheBoite = Pin<Box<dyn Future<Output = ()>>>;

struct Tache {
    nom: &'static str,
    fait: u32,
    total: u32,
}

impl Tache {
    fn new(nom: &'static str, total: u32) -> Self {
        Tache { nom, fait: 0, total }
    }
}

impl Future for Tache {
    type Output = ();

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<()> {
        if self.fait == self.total {
            println!("{} terminée", self.nom);
            Poll::Ready(())
        } else {
            self.fait += 1;
            println!("{} : étape {}/{}", self.nom, self.fait, self.total);
            cx.waker().wake_by_ref();
            Poll::Pending
        }
    }
}

fn executer_tout(futurs: Vec<TacheBoite>) {
    todo!()
}

fn main() {
    let taches: Vec<TacheBoite> = vec![
        Box::pin(Tache::new("A", 2)),
        Box::pin(Tache::new("B", 1)),
        Box::pin(Tache::new("C", 3)),
    ];
    executer_tout(taches);
    println!("toutes les tâches sont terminées");
}
