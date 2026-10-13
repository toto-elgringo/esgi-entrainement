#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn calcul_de_la_tva() {
        assert_eq!(facture::tva(1000), 200, "20 % de 1000 centimes = 200 centimes");
        assert_eq!(facture::prix_ttc(1000), 1200, "1000 HT donne 1200 TTC");
        assert_eq!(facture::prix_ttc(50), 60, "50 HT donne 60 TTC");
    }

    #[test]
    fn remise_simple() {
        assert_eq!(facture::remise::appliquer(1200, 10), 1080, "10 % de remise sur 1200 = 1080");
    }

    #[test]
    fn remise_sur_le_ttc() {
        assert_eq!(facture::remise::sur_prix_ttc(1000, 10), 1080, "1000 HT, TTC 1200, remise 10 % : 1080");
        assert_eq!(facture::remise::sur_prix_ttc(50, 0), 60, "sans remise, on garde le prix TTC");
        assert_eq!(facture::remise::sur_prix_ttc(500, 50), 300, "500 HT, TTC 600, remise 50 % : 300");
    }
}
