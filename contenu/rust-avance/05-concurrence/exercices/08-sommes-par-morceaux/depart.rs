use std::thread;

fn main() {
    let nombres: Vec<u32> = (1..=12).collect();

    let sommes: Vec<u32> = todo!();

    for (i, somme) in sommes.iter().enumerate() {
        println!("Morceau {} : {}", i + 1, somme);
    }
    println!("Total : {}", sommes.iter().sum::<u32>());
}
