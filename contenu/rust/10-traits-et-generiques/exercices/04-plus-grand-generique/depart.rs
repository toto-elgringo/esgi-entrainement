fn plus_grand(a: i32, b: i32) -> i32 {
    if a > b { a } else { b }
}

fn plus_grand_de_la_liste<T: PartialOrd + Copy>(liste: &[T]) -> Option<T> {
    todo!()
}

fn main() {
    println!("{}", plus_grand(3, 7));
    println!("{:?}", plus_grand_de_la_liste(&[3, 9, 2]));
}
