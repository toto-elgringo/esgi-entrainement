#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 355, "12 + 25 + 200 + 49 + 36 + 9 + 24 = 355");
    }

    #[test]
    fn partie1_instructions_abimees() {
        for abimee in ["mul(2,3]", "mul (2,3)", "mul(2, 3)", "mul(1234,5)", "MUL(2,3)", "mul(-2,3)", "mul(2,3,4)", "mul(,3)"] {
            assert_eq!(partie1(abimee), 0, "« {abimee} » n'est pas une instruction valide : elle ne compte pas");
        }
    }

    #[test]
    fn partie1_trois_chiffres() {
        assert_eq!(partie1("xmul(999,999)mul(1,2)"), 998_003, "999 × 999 + 1 × 2 = 998003");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 285, "seules mul(3,4), mul(100,2), mul(7,7) et mul(4,6) sont actives : 285");
    }

    #[test]
    fn partie2_etat_entre_les_lignes() {
        assert_eq!(
            partie2("mul(1,1)don't()\nmul(2,3)do(mul(5,5)\ndo()mul(4,5)"),
            21,
            "le don't() reste valable à la ligne suivante, « do( » ne réactive rien : 1 + 20 = 21"
        );
    }

    #[test]
    fn fins_de_ligne_windows() {
        assert_eq!(partie1("mul(2,3)\r\nmul(4,5)\r\n"), 26, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
