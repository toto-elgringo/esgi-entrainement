fn carre(x: i32) -> i32 {
    x * x;
}

fn est_pair(n: i32) -> bool {
    n % 2 == 0;
}

fn main() {
    println!("5 au carré = {}", carre(5));
    println!("4 est pair ? {}", est_pair(4));
}
