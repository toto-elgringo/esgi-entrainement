use std::sync::atomic::{AtomicUsize, Ordering};
use std::thread;

fn compter_pairs(nombres: &[u32], taille: usize) -> usize {
    let total = AtomicUsize::new(0);
    let total_ref = &total;

    thread::scope(|s| {
        for morceau in nombres.chunks(taille) {
            s.spawn(move || {
                let pairs = morceau.iter().filter(|&&x| x % 2 == 0).count();
                total_ref.fetch_add(pairs, Ordering::Relaxed);
            });
        }
    });

    total.into_inner()
}

fn main() {
    let nombres: Vec<u32> = (1..=100).collect();
    println!("{}", compter_pairs(&nombres, 10));
}
