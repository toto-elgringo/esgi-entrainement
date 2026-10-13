fn changer_derniere_lettre(mut s: String) -> String {
    if s.pop().is_some() {
        s.push('a');
    }
    s
}

fn main() {
    let s = String::from("Coco");
    let s = changer_derniere_lettre(s);
    println!("{s}");
}
