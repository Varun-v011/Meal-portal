"""
One-time script to promote an existing account to admin.
Edit WORKER_ID below, then run:
    python make_admin.py
"""
from sqlalchemy import create_engine, text

WORKER_ID = "11072"  # <-- change this to the actual worker_id you registered

engine = create_engine("mysql+pymysql://web_user:admin123@127.0.0.1:3306/web_db")

with engine.connect() as conn:
    result = conn.execute(
        text("UPDATE users SET role = 'admin' WHERE worker_id = :wid"),
        {"wid": WORKER_ID},
    )
    conn.commit()
    if result.rowcount == 0:
        print(f"No user found with worker_id={WORKER_ID}. Nothing changed.")
    else:
        print(f"Done. {WORKER_ID} is now an admin.")