mod restaurant {
    pub mod entrees {
        pub fn du_jour() -> &'static str {
            "salade"
        }
    }

    pub mod desserts {
        pub fn du_jour() -> &'static str {
            "tarte"
        }
    }
}

fn menu() -> String {
    format!("{} puis {}", entrees::du_jour(), desserts::du_jour())
}

fn menu_complet() -> String {
    todo!()
}

fn main() {
    println!("{}", menu());
    println!("{}", menu_complet());
}
