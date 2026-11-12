use std::thread;

fn somme_en_thread(n: u64) -> u64 {
    let handle = thread::spawn(move || (1..=n).sum::<u64>());
    handle.join().unwrap()
}

fn main() {
    println!("{}", somme_en_thread(10));
    println!("{}", somme_en_thread(100));
}
