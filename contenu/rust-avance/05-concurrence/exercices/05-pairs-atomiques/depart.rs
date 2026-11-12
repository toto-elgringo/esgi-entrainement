use std::sync::atomic::{AtomicUsize, Ordering};
use std::thread;

fn compter_pairs(nombres: &[u32], taille: usize) -> usize {
    todo!()
}

fn main() {
    let nombres: Vec<u32> = (1..=100).collect();
    println!("{}", compter_pairs(&nombres, 10));
}
