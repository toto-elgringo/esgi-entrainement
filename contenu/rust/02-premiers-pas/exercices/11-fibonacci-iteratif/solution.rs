fn fibonacci(n: u64) -> u64 {
    let mut a = 0;
    let mut b = 1;
    for _ in 0..n {
        let tmp = a;
        a = b;
        b += tmp;
    }
    a
}

fn main() {
    println!("F(30) = {}", fibonacci(30));
}
