use std::sync::Mutex;
use std::thread;

fn ordre_verrous(de: usize, vers: usize) -> (usize, usize) {
    todo!()
}

fn transferer(comptes: &[Mutex<i64>], de: usize, vers: usize, montant: i64) {
    todo!()
}

fn main() {
    let comptes = vec![Mutex::new(100), Mutex::new(100)];

    thread::scope(|s| {
        s.spawn(|| {
            for _ in 0..1000 {
                transferer(&comptes, 0, 1, 1);
            }
        });
        s.spawn(|| {
            for _ in 0..1000 {
                transferer(&comptes, 1, 0, 1);
            }
        });
    });

    let total: i64 = comptes.iter().map(|c| *c.lock().unwrap()).sum();
    println!("Total : {total}");
}
