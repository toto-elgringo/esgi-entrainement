fn somme_grand_tableau() -> u64 {
    let tableau = vec![1u8; 9_000_000];
    let mut total = 0;
    for x in &tableau {
        total += u64::from(*x);
    }
    total
}

fn main() {
    println!("{}", somme_grand_tableau());
}
