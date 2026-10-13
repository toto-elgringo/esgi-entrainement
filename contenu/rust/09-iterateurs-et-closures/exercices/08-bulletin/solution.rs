fn main() {
    let notes: Vec<u32> = vec![12, 8, 15, 19, 7, 14];
    println!("Notes : {:?}", notes);

    let moyenne = notes.iter().sum::<u32>() as f64 / notes.len() as f64;
    println!("Moyenne : {}", moyenne);

    if let Some(meilleure) = notes.iter().max() {
        println!("Meilleure : {}", meilleure);
    }

    let recus = notes.iter().filter(|n| **n >= 10).count();
    println!("Reçus : {}", recus);

    let sur_100: Vec<u32> = notes.iter().map(|n| n * 5).collect();
    println!("Notes sur 100 : {:?}", sur_100);
}
