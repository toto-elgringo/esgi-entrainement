#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ordre_inverse() {
        assert_eq!(ordre_verrous(3, 1), (1, 3), "le plus petit numéro passe en premier");
    }

    #[test]
    fn ordre_deja_bon() {
        assert_eq!(ordre_verrous(0, 2), (0, 2), "déjà dans l'ordre croissant");
    }

    #[test]
    fn virement_simple() {
        let comptes = vec![Mutex::new(100), Mutex::new(50)];
        transferer(&comptes, 0, 1, 30);
        assert_eq!(*comptes[0].lock().unwrap(), 70, "le compte de départ perd 30");
        assert_eq!(*comptes[1].lock().unwrap(), 80, "le compte d'arrivée gagne 30");
    }

    #[test]
    fn virement_vers_un_numero_plus_petit() {
        let comptes = vec![Mutex::new(100), Mutex::new(50)];
        transferer(&comptes, 1, 0, 20);
        assert_eq!(*comptes[0].lock().unwrap(), 120, "le compte 0 reçoit 20");
        assert_eq!(*comptes[1].lock().unwrap(), 30, "le compte 1 perd 20");
    }

    #[test]
    fn virements_croises_sans_blocage() {
        let comptes = vec![Mutex::new(1000), Mutex::new(1000), Mutex::new(1000)];
        thread::scope(|s| {
            s.spawn(|| {
                for _ in 0..500 {
                    transferer(&comptes, 0, 1, 2);
                    transferer(&comptes, 1, 2, 1);
                }
            });
            s.spawn(|| {
                for _ in 0..500 {
                    transferer(&comptes, 1, 0, 1);
                    transferer(&comptes, 2, 1, 2);
                }
            });
            s.spawn(|| {
                for _ in 0..500 {
                    transferer(&comptes, 2, 0, 1);
                    transferer(&comptes, 0, 2, 1);
                }
            });
        });
        let total: i64 = comptes.iter().map(|c| *c.lock().unwrap()).sum();
        assert_eq!(total, 3000, "l'argent total ne change jamais");
    }
}
