fn correspond(modele: &str, chemin: &str) -> Option<Vec<(String, String)>> {
    let segments_modele: Vec<&str> = modele.trim_matches('/').split('/').collect();
    let segments_chemin: Vec<&str> = chemin.trim_matches('/').split('/').collect();
    if segments_modele.len() != segments_chemin.len() {
        return None;
    }
    let mut params = Vec::new();
    for (m, c) in segments_modele.iter().zip(segments_chemin.iter()) {
        if let Some(nom) = m.strip_prefix(':') {
            params.push((nom.to_string(), c.to_string()));
        } else if m != c {
            return None;
        }
    }
    Some(params)
}

fn main() {
    println!("{:?}", correspond("/users/:id", "/users/42"));
    println!("{:?}", correspond("/users/:id", "/posts/42"));
}
