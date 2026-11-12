use std::sync::Mutex;
use std::thread;

fn ordre_verrous(de: usize, vers: usize) -> (usize, usize) {
    if de < vers { (de, vers) } else { (vers, de) }
}

fn transferer(comptes: &[Mutex<i64>], de: usize, vers: usize, montant: i64) {
    let (premier, second) = ordre_verrous(de, vers);
    let mut petit = comptes[premier].lock().unwrap();
    let mut grand = comptes[second].lock().unwrap();

    if de < vers {
        *petit -= montant;
        *grand += montant;
    } else {
        *grand -= montant;
        *petit += montant;
    }
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
