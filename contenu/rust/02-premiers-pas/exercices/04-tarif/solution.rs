fn tarif(age: u32) -> u32 {
    if age < 12 {
        5
    } else if age <= 25 {
        8
    } else if age >= 65 {
        6
    } else {
        12
    }
}

fn main() {
    println!("Tarif pour 30 ans : {} €", tarif(30));
}
