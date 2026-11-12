use std::thread;

fn doubler(valeurs: Vec<i32>) -> Vec<i32> {
    let handles: Vec<_> = valeurs
        .into_iter()
        .map(|v| thread::spawn(move || v * 2))
        .collect();
    handles.into_iter().map(|h| h.join().unwrap()).collect()
}

fn main() {
    println!("{:?}", doubler(vec![1, 2, 3]));
}
