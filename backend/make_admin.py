"""
One-time script to promote an existing account to admin.
Edit WORKER_ID below, then run:
    python make_admin.py
"""
from sqlalchemy import create_engine, text

mobile_number = "7010685725"  # <-- change this to the actual mobile number you registered

engine = create_engine("mysql+pymysql://web_user:admin123@127.0.0.1:3306/web_db")

with engine.connect() as conn:
    result = conn.execute(
        text("UPDATE users SET role = 'admin' WHERE mobile_number = :mobile_number"),
        {"mobile_number": mobile_number},
    )
    conn.commit()
    if result.rowcount == 0:
        print(f"No user found with mobile_number={mobile_number}. Nothing changed.")
    else:
        print(f"Done. {mobile_number} is now an admin.")