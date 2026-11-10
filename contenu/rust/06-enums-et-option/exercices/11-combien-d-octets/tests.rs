#[cfg(test)]
mod tests {
    use super::*;
    use std::mem::size_of;
    use std::num::NonZeroU32;

    #[test]
    fn potion() {
        assert_eq!(POTION, size_of::<Potion>(), "Potion : une étiquette + un octet de donnée");
    }

    #[test]
    fn arme() {
        assert_eq!(ARME, size_of::<Arme>(), "Arme : la variante Arc (u8 + u32) avec l'étiquette, alignée sur 4");
    }

    #[test]
    fn objet() {
        assert_eq!(OBJET, size_of::<Objet>(), "Objet : son étiquette se cache dans une niche de l'étiquette d'Arme");
    }

    #[test]
    fn option_u8() {
        assert_eq!(OPTION_U8, size_of::<Option<u8>>(), "Option<u8> : un u8 utilise ses 256 valeurs, il faut une étiquette");
    }

    #[test]
    fn option_u32() {
        assert_eq!(OPTION_U32, size_of::<Option<u32>>(), "Option<u32> : étiquette + 4 octets, arrondi à l'alignement de 4");
    }

    #[test]
    fn option_non_nul() {
        assert_eq!(OPTION_NON_NUL, size_of::<Option<NonZeroU32>>(), "Option<NonZeroU32> : 0 est libre pour coder None");
    }

    #[test]
    fn option_reference() {
        assert_eq!(OPTION_REFERENCE, size_of::<Option<&u8>>(), "Option<&u8> : une référence n'est jamais nulle");
    }

    #[test]
    fn option_bool() {
        assert_eq!(OPTION_BOOL, size_of::<Option<bool>>(), "Option<bool> : un bool n'utilise que 0 et 1, None vaut 2");
    }
}
