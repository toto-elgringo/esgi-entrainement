use std::sync::mpsc;
use std::thread;

fn collecter(producteurs: u32, par_producteur: u32) -> Vec<u32> {
    let (tx, rx) = mpsc::channel();
    let mut handles = Vec::new();

    for id in 0..producteurs {
        let tx = tx.clone();
        handles.push(thread::spawn(move || {
            for i in 0..par_producteur {
                tx.send(id * 100 + i).unwrap();
            }
        }));
    }
    drop(tx);

    let mut resultats: Vec<u32> = rx.iter().collect();
    for handle in handles {
        handle.join().unwrap();
    }
    resultats.sort();
    resultats
}

fn main() {
    println!("{:?}", collecter(3, 2));
}
