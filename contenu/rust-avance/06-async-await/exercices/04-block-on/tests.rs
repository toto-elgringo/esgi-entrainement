#[cfg(test)]
mod tests {
    use super::*;
    use std::future::Future;
    use std::pin::Pin;
    use std::task::{Context, Poll};

    struct Attente {
        restant: u32,
        polls: u32,
    }

    impl Future for Attente {
        type Output = u32;

        fn poll(mut self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<u32> {
            self.polls += 1;
            if self.restant == 0 {
                Poll::Ready(self.polls)
            } else {
                self.restant -= 1;
                Poll::Pending
            }
        }
    }

    #[test]
    fn bloc_async_simple() {
        assert_eq!(block_on(async { 20 + 22 }), 42, "un bloc async simple");
    }

    #[test]
    fn futur_deja_pret() {
        assert_eq!(block_on(std::future::ready("ok")), "ok", "un futur déjà prêt");
    }

    #[test]
    fn futur_qui_attend() {
        let polls = block_on(Attente { restant: 4, polls: 0 });
        assert_eq!(polls, 5, "il faut interroger le futur jusqu'à Ready (4 Pending puis 1 Ready)");
    }

    #[test]
    fn futurs_enchaines() {
        let resultat = block_on(async {
            let a = Attente { restant: 2, polls: 0 }.await;
            let b = Attente { restant: 1, polls: 0 }.await;
            a + b
        });
        assert_eq!(resultat, 5, "deux futurs à la suite");
    }
}
