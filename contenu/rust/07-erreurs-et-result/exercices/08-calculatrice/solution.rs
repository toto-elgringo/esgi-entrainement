#[derive(Debug, PartialEq)]
enum ErreurCalcul {
    FormatInvalide,
    NombreInvalide(String),
    OperateurInconnu(String),
    DivisionParZero,
}

fn lire_nombre(texte: &str) -> Result<i64, ErreurCalcul> {
    texte
        .parse::<i64>()
        .map_err(|_| ErreurCalcul::NombreInvalide(texte.to_string()))
}

fn calculer(expression: &str) -> Result<i64, ErreurCalcul> {
    let mut morceaux = expression.split_whitespace();
    let gauche = morceaux.next().ok_or(ErreurCalcul::FormatInvalide)?;
    let operateur = morceaux.next().ok_or(ErreurCalcul::FormatInvalide)?;
    let droite = morceaux.next().ok_or(ErreurCalcul::FormatInvalide)?;
    if morceaux.next().is_some() {
        return Err(ErreurCalcul::FormatInvalide);
    }

    let a = lire_nombre(gauche)?;
    let b = lire_nombre(droite)?;

    match operateur {
        "+" => Ok(a + b),
        "-" => Ok(a - b),
        "*" => Ok(a * b),
        "/" if b == 0 => Err(ErreurCalcul::DivisionParZero),
        "/" => Ok(a / b),
        autre => Err(ErreurCalcul::OperateurInconnu(autre.to_string())),
    }
}

fn main() {
    for expression in ["12 + 30", "7 * 6", "8 / 0", "2 ^ 3", "deux + 2", "1 +"] {
        println!("{expression} -> {:?}", calculer(expression));
    }
}
