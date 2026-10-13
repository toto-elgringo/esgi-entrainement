#[derive(Debug, PartialEq)]
enum Commande {
    Ajoute(i64),
    Retire(i64),
    Multiplie(i64),
    Reset,
}

#[derive(Debug, PartialEq)]
enum ErreurCommande {
    Inconnue(String),
    ArgumentManquant(String),
    NombreInvalide(String),
}

fn analyser(ligne: &str) -> Result<Commande, ErreurCommande> {
    let mut morceaux = ligne.split_whitespace();
    let nom = morceaux.next().unwrap_or("");
    if nom == "reset" {
        return Ok(Commande::Reset);
    }
    if !["ajoute", "retire", "multiplie"].contains(&nom) {
        return Err(ErreurCommande::Inconnue(nom.to_string()));
    }
    let argument = morceaux
        .next()
        .ok_or_else(|| ErreurCommande::ArgumentManquant(nom.to_string()))?;
    let nombre = argument
        .parse::<i64>()
        .map_err(|_| ErreurCommande::NombreInvalide(argument.to_string()))?;
    Ok(match nom {
        "ajoute" => Commande::Ajoute(nombre),
        "retire" => Commande::Retire(nombre),
        _ => Commande::Multiplie(nombre),
    })
}

fn executer(programme: &str) -> Result<i64, (usize, ErreurCommande)> {
    let mut valeur = 0;
    for (index, ligne) in programme.lines().enumerate() {
        if ligne.trim().is_empty() {
            continue;
        }
        let commande = analyser(ligne).map_err(|erreur| (index + 1, erreur))?;
        valeur = match commande {
            Commande::Ajoute(nombre) => valeur + nombre,
            Commande::Retire(nombre) => valeur - nombre,
            Commande::Multiplie(nombre) => valeur * nombre,
            Commande::Reset => 0,
        };
    }
    Ok(valeur)
}

fn main() {
    println!("{:?}", executer("ajoute 5\nmultiplie 3\nretire 1"));
    println!("{:?}", executer("ajoute 1\n\nmultiplie x"));
}
