fn produit(liste: &[i64]) -> i64 {
    match liste {
        [] => 1,
        [premier, reste @ ..] => premier * produit(reste),
    }
}

fn maximum(liste: &[i32]) -> Option<i32> {
    match liste {
        [] => None,
        [premier, reste @ ..] => Some(maximum(reste).map_or(*premier, |m| m.max(*premier))),
    }
}

fn est_croissante(liste: &[i32]) -> bool {
    match liste {
        [a, b, ..] => a <= b && est_croissante(&liste[1..]),
        _ => true,
    }
}

fn inverser(liste: &[i32]) -> Vec<i32> {
    match liste {
        [] => Vec::new(),
        [debut @ .., dernier] => [vec![*dernier], inverser(debut)].concat(),
    }
}

fn puissance(base: u64, exposant: u32) -> u64 {
    match exposant {
        0 => 1,
        e if e % 2 == 0 => {
            let moitie = puissance(base, e / 2);
            moitie * moitie
        }
        e => base * puissance(base, e - 1),
    }
}

fn main() {
    println!("{}", produit(&[2, 3, 4]));
    println!("{:?}", maximum(&[3, 9, 2]));
    println!("{}", est_croissante(&[1, 2, 2, 5]));
    println!("{:?}", inverser(&[1, 2, 3]));
    println!("{}", puissance(2, 10));
}
