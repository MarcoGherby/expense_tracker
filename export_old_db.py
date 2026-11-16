# One-off script: exports the old Flask database to a JSON backup
# that the new app can import ("Importa backup").
import json
import sqlite3

conn = sqlite3.connect("expense_tracker.db")
conn.row_factory = sqlite3.Row
rows = conn.execute(
    "SELECT kind, description, category, amount, transaction_date FROM transactions"
).fetchall()
budget = conn.execute(
    "SELECT value FROM settings WHERE key = 'monthly_budget'"
).fetchone()

data = {
    "budget": float(budget["value"]) if budget else 1000,
    "transactions": [dict(r) for r in rows],
}
with open("old_data_backup.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"Exported {len(rows)} transactions to old_data_backup.json")
