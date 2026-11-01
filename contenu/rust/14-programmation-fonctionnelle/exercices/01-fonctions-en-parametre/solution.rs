fn appliquer_deux_fois(f: impl Fn(i32) -> i32, x: i32) -> i32 {
    f(f(x))
}

fn appliquer_a_tous(nombres: &[i32], f: impl Fn(i32) -> i32) -> Vec<i32> {
    nombres.iter().map(|&n| f(n)).collect()
}

fn compter_si(nombres: &[i32], condition: impl Fn(i32) -> bool) -> usize {
    nombres.iter().filter(|&&n| condition(n)).count()
}

fn appliquer_n_fois(f: impl Fn(i32) -> i32, n: u32, x: i32) -> i32 {
    (0..n).fold(x, |acc, _| f(acc))
}

fn double(x: i32) -> i32 {
    x * 2
}

fn main() {
    println!("{}", appliquer_deux_fois(|x| x + 3, 10));
    println!("{:?}", appliquer_a_tous(&[1, 2, 3], double));
    println!("{}", compter_si(&[3, -1, 8, 0], |x| x > 0));
    println!("{}", appliquer_n_fois(double, 3, 1));
}
