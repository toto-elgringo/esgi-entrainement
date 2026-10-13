#[derive(Debug, PartialEq)]
enum ErreurCommande {
    ProduitInconnu,
    StockInsuffisant,
}

fn prix_unitaire(produit: &str) -> Option<u32> {
    match produit {
        "pomme" => Some(2),
        "pain" => Some(3),
        "lait" => Some(4),
        _ => None,
    }
}

fn stock(produit: &str) -> u32 {
    match produit {
        "pomme" => 10,
        "lait" => 5,
        _ => 0,
    }
}

fn commander(produit: &str, quantite: u32) -> Result<u32, ErreurCommande> {
    let prix = prix_unitaire(produit).ok_or(ErreurCommande::ProduitInconnu)?;
    if stock(produit) < quantite {
        return Err(ErreurCommande::StockInsuffisant);
    }
    Ok(prix * quantite)
}

fn main() {
    println!("{:?}", commander("pomme", 3));
    println!("{:?}", commander("pain", 1));
    println!("{:?}", commander("chocolat", 1));
}
