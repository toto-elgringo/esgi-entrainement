fn changer_derniere_lettre(mut s: String) {
    if s.pop().is_some() {
        s.push('a');
    }
}

fn main() {
    let s = String::from("Coco");
    changer_derniere_lettre(s);
    println!("{s}");
}
