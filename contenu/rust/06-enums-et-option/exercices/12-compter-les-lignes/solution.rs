fn compter_lignes(chemin: &str) -> std::io::Result<usize> {
    let contenu = std::fs::read_to_string(chemin)?;
    Ok(contenu.lines().count())
}

fn resume(chemin: &str) -> String {
    match compter_lignes(chemin) {
        Ok(n) => format!("{n} lignes"),
        Err(e) => format!("impossible de lire {chemin} : {e}"),
    }
}

fn main() {
    println!("{}", resume("Cargo.toml"));
    println!("{}", resume("fichier-absent.txt"));
}
