"""
One-time script to promote an existing account to admin.
Edit Mobile_number below, then run:
    python make_admin.py
"""
from sqlalchemy import create_engine, text

mobile_number = ""  # <-- change this to the actual mobile number you registered
#in this pc pass:admin123 for server pc pass:admin1234
engine = create_engine("mysql+pymysql://web_user:admin1234@127.0.0.1:3306/mealportal_db")

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