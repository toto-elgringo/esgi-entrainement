fn mention(note: u8) -> &'static str {
    match note {
        0..=9 => "insuffisant",
        10..=11 => "passable",
        12..=13 => "assez bien",
        14..=15 => "bien",
        16..=20 => "très bien",
        _ => "note invalide",
    }
}

fn main() {
    println!("15 sur 20 : {}", mention(15));
}
