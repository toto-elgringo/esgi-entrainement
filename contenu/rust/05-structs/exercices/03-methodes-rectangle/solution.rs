struct Rectangle {
    largeur: u32,
    hauteur: u32,
}

impl Rectangle {
    fn aire(&self) -> u32 {
        self.largeur * self.hauteur
    }

    fn perimetre(&self) -> u32 {
        2 * (self.largeur + self.hauteur)
    }

    fn peut_contenir(&self, autre: &Rectangle) -> bool {
        autre.largeur <= self.largeur && autre.hauteur <= self.hauteur
    }

    fn carre(cote: u32) -> Self {
        Self {
            largeur: cote,
            hauteur: cote,
        }
    }
}

fn main() {
    let r = Rectangle { largeur: 3, hauteur: 4 };
    println!("Aire : {}", r.aire());
    println!("Périmètre : {}", r.perimetre());
}
