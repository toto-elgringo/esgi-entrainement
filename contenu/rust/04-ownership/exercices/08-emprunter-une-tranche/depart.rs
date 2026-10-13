fn somme(nombres: Vec<i32>) -> i32 {
    let mut total = 0;
    for n in nombres {
        total += n;
    }
    total
}

fn moyenne(nombres: Vec<i32>) -> f64 {
    f64::from(somme(nombres)) / nombres.len() as f64
}

fn main() {
    let notes = vec![12, 15, 9];
    println!("moyenne : {}", moyenne(notes));
    println!("nombre de notes : {}", notes.len());
}
