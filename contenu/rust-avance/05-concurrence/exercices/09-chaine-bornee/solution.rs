use std::sync::mpsc;
use std::thread;

fn chaine(valeurs: Vec<i64>, capacite: usize) -> Vec<i64> {
    let (tx_entree, rx_entree) = mpsc::sync_channel(capacite);
    let (tx_sortie, rx_sortie) = mpsc::sync_channel(capacite);

    let producteur = thread::spawn(move || {
        for v in valeurs {
            tx_entree.send(v).unwrap();
        }
    });

    let transformateur = thread::spawn(move || {
        for v in rx_entree {
            tx_sortie.send(v * 2).unwrap();
        }
    });

    let resultats: Vec<i64> = rx_sortie.iter().collect();
    producteur.join().unwrap();
    transformateur.join().unwrap();
    resultats
}

fn main() {
    println!("{:?}", chaine(vec![1, 2, 3], 2));
}
