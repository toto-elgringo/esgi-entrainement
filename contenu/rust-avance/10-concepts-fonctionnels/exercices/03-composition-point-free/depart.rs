fn composer<A, B, C>(f: impl Fn(A) -> B, g: impl Fn(B) -> C) -> impl Fn(A) -> C {
    todo!()
}

fn double(x: i32) -> i32 {
    x * 2
}

fn abs_puis_double() -> impl Fn(i32) -> i32 {
    todo!()
}

fn main() {
    let f = abs_puis_double();
    println!("{}", f(-7));
    println!("{}", f(4));
}
