use std::sync::{Arc, Mutex};
use std::thread;

fn compter(nb_threads: usize, increments: usize) -> usize {
    let compteur = Arc::new(Mutex::new(0));
    let mut handles = Vec::new();

    for _ in 0..nb_threads {
        let compteur = Arc::clone(&compteur);
        handles.push(thread::spawn(move || {
            for _ in 0..increments {
                *compteur.lock().unwrap() += 1;
            }
        }));
    }

    for handle in handles {
        handle.join().unwrap();
    }

    Arc::try_unwrap(compteur).unwrap().into_inner().unwrap()
}

fn main() {
    println!("{}", compter(4, 1000));
}
