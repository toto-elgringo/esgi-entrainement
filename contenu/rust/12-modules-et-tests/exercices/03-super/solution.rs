fn taux_tva() -> u64 {
    20
}

mod facture {
    pub fn tva(prix_ht: u64) -> u64 {
        prix_ht * super::taux_tva() / 100
    }

    pub fn prix_ttc(prix_ht: u64) -> u64 {
        prix_ht + tva(prix_ht)
    }

    pub mod remise {
        pub fn appliquer(prix: u64, pourcentage: u64) -> u64 {
            prix - prix * pourcentage / 100
        }

        pub fn sur_prix_ttc(prix_ht: u64, pourcentage: u64) -> u64 {
            appliquer(super::prix_ttc(prix_ht), pourcentage)
        }
    }
}

fn main() {
    println!("TTC : {} centimes", facture::prix_ttc(1000));
    println!("Avec remise : {} centimes", facture::remise::sur_prix_ttc(1000, 10));
}
