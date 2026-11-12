use std::collections::HashMap;

macro_rules! hashmap {
    () => {
        todo!()
    };
}

fn main() {
    let ages = hashmap! {
        "Ada" => 36,
        "Alan" => 41,
    };
    let mut noms: Vec<_> = ages.iter().collect();
    noms.sort();
    println!("{:?}", noms);
}
