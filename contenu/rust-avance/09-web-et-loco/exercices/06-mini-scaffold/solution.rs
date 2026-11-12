fn majuscule(texte: &str) -> String {
    let mut lettres = texte.chars();
    match lettres.next() {
        Some(premiere) => premiere.to_uppercase().collect::<String>() + lettres.as_str(),
        None => String::new(),
    }
}

fn type_rust(type_loco: &str) -> &'static str {
    match type_loco {
        "double" => "f64",
        "int" => "i64",
        _ => "String",
    }
}

fn scaffold(nom: &str, champs: &[(&str, &str)]) -> String {
    let mut lignes = vec![format!("struct {} {{", majuscule(nom)), "    id: i64,".to_string()];
    for (champ, type_loco) in champs {
        lignes.push(format!("    {}: {},", champ, type_rust(type_loco)));
    }
    lignes.push("}".to_string());
    let base = format!("/{nom}s");
    lignes.push(format!("GET {base}"));
    lignes.push(format!("POST {base}"));
    lignes.push(format!("GET {base}/:id"));
    lignes.push(format!("PUT {base}/:id"));
    lignes.push(format!("DELETE {base}/:id"));
    lignes.join("\n")
}

fn main() {
    println!("{}", scaffold("capteur", &[("nom", "string"), ("valeur", "double")]));
    println!();
    println!("{}", scaffold("mesure", &[("valeur", "double"), ("capteur", "int")]));
}
