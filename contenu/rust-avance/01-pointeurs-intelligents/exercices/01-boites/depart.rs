fn envelopper(n: i32) -> Box<i32> {
    todo!()
}

fn incrementer(boite: &mut i32) {
    todo!()
}

fn additionner(a: &i32, b: &i32) -> Box<i32> {
    todo!()
}

fn choisir_operation(nom: &str) -> Option<Box<dyn Fn(i32) -> i32>> {
    todo!()
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
