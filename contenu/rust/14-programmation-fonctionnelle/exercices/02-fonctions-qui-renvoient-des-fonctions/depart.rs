fn additionneur(n: i32) -> impl Fn(i32) -> i32 {
    |_| todo!()
}

fn multiplicateur(n: i32) -> impl Fn(i32) -> i32 {
    |_| todo!()
}

fn composer(f: impl Fn(i32) -> i32, g: impl Fn(i32) -> i32) -> impl Fn(i32) -> i32 {
    |_| todo!()
}

fn operation(symbole: char) -> Box<dyn Fn(i32, i32) -> i32> {
    todo!()
}

fn enchainer(etapes: Vec<Box<dyn Fn(i32) -> i32>>) -> impl Fn(i32) -> i32 {
    |_| todo!()
}

fn main() {
    let plus_un = additionneur(1);
    let fois_10 = multiplicateur(10);
    println!("{}", plus_un(4));
    println!("{}", composer(plus_un, fois_10)(4));
    println!("{}", operation('*')(6, 7));

    let etapes: Vec<Box<dyn Fn(i32) -> i32>> = vec![Box::new(additionneur(1)), Box::new(multiplicateur(2))];
    println!("{}", enchainer(etapes)(5));
}
