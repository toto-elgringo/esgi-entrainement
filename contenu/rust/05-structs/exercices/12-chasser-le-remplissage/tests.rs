#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn plus_aucun_trou() {
        assert_eq!(
            size_of::<Mesure>(),
            16,
            "16 octets de données : la struct doit faire 16 octets, sans remplissage"
        );
    }

    #[test]
    fn alignement_inchange() {
        assert_eq!(align_of::<Mesure>(), 8, "l'alignement reste celui du u64");
    }

    #[test]
    fn le_u64_en_tete() {
        assert_eq!(
            offset_of!(Mesure, horodatage),
            0,
            "horodatage (8 octets) doit être en premier"
        );
    }

    #[test]
    fn puis_le_u32_et_le_u16() {
        assert_eq!(
            offset_of!(Mesure, valeur),
            8,
            "valeur (u32) doit suivre horodatage, à l'octet 8"
        );
        assert_eq!(
            offset_of!(Mesure, numero),
            12,
            "numero (u16) doit suivre valeur, à l'octet 12"
        );
    }

    #[test]
    fn les_octets_seuls_a_la_fin() {
        let fin = [offset_of!(Mesure, niveau), offset_of!(Mesure, actif)];
        assert!(
            fin.contains(&14) && fin.contains(&15),
            "niveau et actif (1 octet chacun) occupent les octets 14 et 15"
        );
    }

    #[test]
    fn les_champs_existent_toujours() {
        let m = Mesure {
            actif: true,
            horodatage: 1_700_000_000,
            niveau: 3,
            valeur: 42,
            numero: 7,
        };
        assert!(
            m.actif && m.horodatage == 1_700_000_000 && m.niveau == 3 && m.valeur == 42 && m.numero == 7,
            "les cinq champs gardent leur nom et leur type"
        );
    }
}
