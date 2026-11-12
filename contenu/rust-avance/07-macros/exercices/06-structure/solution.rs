macro_rules! structure {
    ($nom:ident { $($champ:ident : $type:ty),* $(,)? }) => {
        struct $nom {
            $($champ: $type),*
        }

        impl $nom {
            $(
                fn $champ(&self) -> &$type {
                    &self.$champ
                }
            )*
        }
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
