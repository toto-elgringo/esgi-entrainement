use std::thread;

fn main() {
    let nombres: Vec<u32> = (1..=12).collect();

    let sommes: Vec<u32> = thread::scope(|s| {
        let handles: Vec<_> = nombres
            .chunks(4)
            .map(|morceau| s.spawn(move || morceau.iter().sum::<u32>()))
            .collect();
        handles.into_iter().map(|h| h.join().unwrap()).collect()
    });

    for (i, somme) in sommes.iter().enumerate() {
        println!("Morceau {} : {}", i + 1, somme);
    }
    println!("Total : {}", sommes.iter().sum::<u32>());
}
