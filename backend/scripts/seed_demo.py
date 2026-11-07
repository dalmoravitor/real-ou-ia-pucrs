"""Apaga o ranking e as respostas e gera 20 jogadores fictícios para demonstração.

Uso (dentro de backend/):  venv/bin/python -m scripts.seed_demo
"""
import random

from app.core.config import ROUND_TIME_LIMIT_MS
from app.db.database import get_connection, init_db
from app.repositories import cards_repository, leaderboard_repository, stats_repository

NAMES = [
    "Ana", "Bruno", "Camila", "Diego", "Eduarda", "Felipe", "Gabriela", "Henrique", "Isabela", "João",
    "Karen", "Lucas", "Mariana", "Nicolas", "Olívia", "Pedro", "Rafaela", "Samuel", "Tainá", "Vitória",
]
ROUNDS = 10
BASE, STREAK_BASE, STREAK_MULT, SPEED_PER_SEC = 100, 25, 1.4, 5

random.seed(42)


def streak_bonus(streak: int) -> int:
    return 0 if streak == 0 else round(STREAK_BASE * STREAK_MULT ** (streak - 1))


def main() -> None:
    init_db()
    cards = cards_repository.list_cards("all")
    if not cards:
        raise SystemExit("Nenhum card cadastrado.")

    # Dificuldade intrínseca de cada card: chance base de acerto e tempo típico.
    profile = {}
    for c in cards:
        p_correct = random.uniform(0.25, 0.92)
        typical_ms = 3000 + (1 - p_correct) * 7000
        profile[str(c["id"])] = (p_correct, typical_ms)

    with get_connection() as conn:
        conn.execute("DELETE FROM guesses")
        conn.execute("DELETE FROM leaderboard")
        conn.execute("DELETE FROM sqlite_sequence WHERE name IN ('guesses', 'leaderboard')")

        for i, name in enumerate(NAMES, start=1):
            participant_id = f"first-demo{i:02d}{random.getrandbits(40):010x}"
            skill = random.uniform(-0.15, 0.15)  # jogadores melhores/piores
            score = streak = best = 0

            for card in random.sample(cards, min(ROUNDS, len(cards))):
                cid = str(card["id"])
                p, typical = profile[cid]
                timed_out = random.random() < 0.03
                correct = (not timed_out) and random.random() < min(max(p + skill, 0.05), 0.97)
                ms = ROUND_TIME_LIMIT_MS if timed_out else int(
                    min(max(random.gauss(typical, 1800), 1200), ROUND_TIME_LIMIT_MS - 200)
                )
                is_ai = bool(card.get("isAi", card.get("is_ai", False)))
                answered_ai = is_ai if correct else not is_ai
                stats_repository.insert_guess(
                    conn, cid, participant_id, "ai" if answered_ai else "real", correct, timed_out, ms
                )

                if correct:
                    time_left = max(0, (ROUND_TIME_LIMIT_MS - ms) // 1000)
                    score += BASE + streak_bonus(streak) + time_left * SPEED_PER_SEC
                    streak += 1
                    best = max(best, streak)
                else:
                    streak = 0

            leaderboard_repository.insert_entry(conn, name, participant_id, score, best)

    print(f"{len(NAMES)} jogadores e {len(NAMES) * ROUNDS} respostas inseridos.")


if __name__ == "__main__":
    main()
