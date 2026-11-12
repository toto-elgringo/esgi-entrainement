fn fixer_premier<A: Clone, B, C>(f: impl Fn(A, B) -> C, a: A) -> impl Fn(B) -> C {
    todo!()
}

fn main() {
    let multiplier = |a: i32, b: i32| a * b;
    let triple = fixer_premier(multiplier, 3);
    println!("{}", triple(5));

    let saluer = |formule: &str, nom: &str| format!("{formule}, {nom} !");
    let bonjour = fixer_premier(saluer, "Bonjour");
    println!("{}", bonjour("Ada"));
}
