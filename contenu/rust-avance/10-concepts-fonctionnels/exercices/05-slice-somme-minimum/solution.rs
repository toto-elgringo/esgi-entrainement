fn somme(liste: &[i32]) -> i32 {
    match liste {
        [] => 0,
        [premier, reste @ ..] => premier + somme(reste),
    }
}

fn minimum(liste: &[i32]) -> Option<i32> {
    match liste {
        [] => None,
        [seul] => Some(*seul),
        [premier, reste @ ..] => minimum(reste).map(|m| m.min(*premier)),
    }
}

fn main() {
    println!("{}", somme(&[1, 2, 3, 4]));
    println!("{:?}", minimum(&[5, 2, 9]));
    println!("{:?}", minimum(&[]));
}
