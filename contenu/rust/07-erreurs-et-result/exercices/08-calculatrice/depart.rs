#[derive(Debug, PartialEq)]
enum ErreurCalcul {
    FormatInvalide,
    NombreInvalide(String),
    OperateurInconnu(String),
    DivisionParZero,
}

fn calculer(expression: &str) -> Result<i64, ErreurCalcul> {
    todo!()
}

fn main() {
    for expression in ["12 + 30", "7 * 6", "8 / 0", "2 ^ 3", "deux + 2", "1 +"] {
        println!("{expression} -> {:?}", calculer(expression));
    }
}
