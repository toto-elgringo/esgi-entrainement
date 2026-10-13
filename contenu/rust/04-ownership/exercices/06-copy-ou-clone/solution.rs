#[derive(Debug, Clone, Copy)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let a = 5;
    let b = a;
    println!("{a} {b}");

    let s1 = String::from("salut");
    let s2 = s1.clone();
    println!("{s1} {s2}");

    let p1 = Point { x: 1, y: 2 };
    let p2 = p1;
    println!("{p1:?} {p2:?}");
}
