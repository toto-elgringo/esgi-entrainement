fn envelopper(n: i32) -> Box<i32> {
    Box::new(n)
}

fn incrementer(boite: &mut i32) {
    *boite += 1;
}

fn additionner(a: &i32, b: &i32) -> Box<i32> {
    Box::new(a + b)
}

fn choisir_operation(nom: &str) -> Option<Box<dyn Fn(i32) -> i32>> {
    match nom {
        "double" => Some(Box::new(|x| x * 2)),
        "carre" => Some(Box::new(|x| x * x)),
        "oppose" => Some(Box::new(|x| -x)),
        _ => None,
    }
}

fn main() {
    let somme = additionner(&envelopper(20), &22);
    println!("somme : {somme}");
    let mut boite = envelopper(1);
    incrementer(&mut boite);
    println!("boite : {boite}");
    if let Some(operation) = choisir_operation("double") {
        println!("double de 21 : {}", operation(21));
    }
}
