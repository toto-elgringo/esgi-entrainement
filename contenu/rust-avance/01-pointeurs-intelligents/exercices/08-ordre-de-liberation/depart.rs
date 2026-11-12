struct Etiquette {
    nom: &'static str,
}

fn main() {
    let _a = Etiquette { nom: "a" };
    {
        let _b = Etiquette { nom: "b" };
        println!("dans le bloc");
    }
    let c = Etiquette { nom: "c" };
    let _d = Box::new(Etiquette { nom: "d" });
    drop(c);
    println!("après drop de c");
    println!("fin du main");
}
