mod geometrie {
    fn double(valeur: u32) -> u32 {
        valeur * 2
    }

    fn aire_rectangle(largeur: u32, hauteur: u32) -> u32 {
        largeur * hauteur
    }

    fn perimetre_rectangle(largeur: u32, hauteur: u32) -> u32 {
        double(largeur + hauteur)
    }
}

fn main() {
    println!("Aire : {}", geometrie::aire_rectangle(3, 4));
    println!("Périmètre : {}", geometrie::perimetre_rectangle(3, 4));
}
