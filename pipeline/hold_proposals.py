"""AI hold suggestions for one complaint, computed on demand from its money trail and never stored.

`conn` uses the default tuple row factory, like the rest of the pipeline.
"""
from pipeline.models.mule_detector import setting

DURATION_HOURS = 24


def proposals(conn, complaint_id):
    """Accounts in the complaint's FIFO trail that still hold traced money and score at or above the hold threshold."""
    rows = conn.execute(
        """WITH trail AS (
               SELECT to_ref AS ref, traced_amount AS amount FROM victim_mapping
               WHERE complaint_id = %(c)s AND method = 'fifo' AND status = 'done'
               UNION ALL
               SELECT from_ref, -traced_amount FROM victim_mapping
               WHERE complaint_id = %(c)s AND method = 'fifo' AND status = 'done')
           SELECT a.account_id, a.bank_id, SUM(t.amount), s.score, s.reasons
           FROM trail t
           JOIN accounts a ON a.account_id = t.ref AND a.kind = 'bank'
           JOIN account_scores s ON s.account_id = a.account_id
           JOIN complaints c ON c.id = %(c)s
           WHERE s.score >= %(threshold)s
             AND a.account_id IS DISTINCT FROM c.victim_account_id
             AND (c.victim_upi_id IS NULL OR a.upi_id IS DISTINCT FROM c.victim_upi_id)
             AND NOT EXISTS (SELECT 1 FROM holds h WHERE h.account_id = a.account_id
                             AND h.status IN ('requested', 'active', 'confirmed'))
           GROUP BY a.account_id, a.bank_id, s.score, s.reasons
           HAVING SUM(t.amount) > 0 AND SUM(t.amount) >= %(minimum)s
           ORDER BY s.score DESC, SUM(t.amount) DESC, a.account_id""",
        dict(c=complaint_id, threshold=float(setting(conn, "hold_threshold", 70)),
             minimum=float(setting(conn, "hold_min_amount_inr", 1000)))).fetchall()
    out = []
    for account_id, bank_id, amount, score, reasons in rows:
        score = float(score)
        texts = [r["reason_text"] for r in reasons if r.get("reason_text")][:2]
        out.append(dict(account_id=account_id, bank_id=bank_id, complaint_id=complaint_id, amount=float(amount), score=score,
                        reason="; ".join(texts) or f"Mule risk score {score:g}", basis="ai_draft", duration_hours=DURATION_HOURS))
    return out
