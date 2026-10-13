struct Rectangle {
    largeur: u32,
    hauteur: u32,
}

impl Rectangle {
    fn aire(&self) -> u32 {
        todo!()
    }

    fn perimetre(&self) -> u32 {
        todo!()
    }

    fn peut_contenir(&self, autre: &Rectangle) -> bool {
        todo!()
    }

    fn carre(cote: u32) -> Self {
        todo!()
    }
}

fn main() {
    let r = Rectangle { largeur: 3, hauteur: 4 };
    println!("Aire : {}", r.aire());
    println!("Périmètre : {}", r.perimetre());
}
