fn correspond(modele: &str, chemin: &str) -> Option<Vec<(String, String)>> {
    todo!()
}

fn main() {
    println!("{:?}", correspond("/users/:id", "/users/42"));
    println!("{:?}", correspond("/users/:id", "/posts/42"));
}
