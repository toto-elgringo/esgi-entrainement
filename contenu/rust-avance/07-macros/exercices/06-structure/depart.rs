macro_rules! structure {
    ($nom:ident { $($champ:ident : $type:ty),* $(,)? }) => {
        todo!();
    };
}

structure!(Personne {
    nom: String,
    age: u32,
});

fn main() {
    let p = Personne {
        nom: String::from("Ada"),
        age: 36,
    };
    println!("{} a {} ans", p.nom(), p.age());
}
