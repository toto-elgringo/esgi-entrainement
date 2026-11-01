#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), "UGST", "caisses déplacées une par une : U, G, S et T en haut des piles");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), "RUST", "caisses déplacées d'un bloc : R, U, S et T en haut des piles");
    }

    #[test]
    fn ordre_inverse_ou_garde() {
        let entree = "[A]\n[B]\n[C]\n[E] [D]\n 1   2\n\nmove 3 from 1 to 2";
        assert_eq!(partie1(entree), "EC", "une par une, la dernière caisse déplacée (C) finit en haut");
        assert_eq!(partie2(entree), "EA", "d'un bloc, la caisse du haut (A) reste en haut");
    }

    #[test]
    fn espaces_du_debut_et_lignes_courtes() {
        let entree = "    [X]\n[Y] [Z]\n 1   2\n\nmove 1 from 2 to 1";
        assert_eq!(partie1(entree), "XZ", "les espaces du début comptent : X est sur la pile 2, pas sur la pile 1");
        let entree = "[X]\n[Y] [Z]\n 1   2\n\nmove 1 from 1 to 2";
        assert_eq!(partie2(entree), "YX", "une ligne du dessin peut être plus courte que les autres");
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = "    [X]\r\n[Y] [Z]\r\n 1   2 \r\n\r\nmove 1 from 2 to 1\r\n";
        assert_eq!(partie1(entree), "XZ", "les fins de ligne Windows (\r\n) sont gérées");
        assert_eq!(partie2(entree), "XZ", "les fins de ligne Windows (\r\n) sont gérées");
    }
}
