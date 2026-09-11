class MealOrder(db.Model):
    __tablename__ = "meal_orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    meal_type = db.Column(db.String(20), nullable=False)     # "breakfast" | "lunch" | "dinner"
    quantity = db.Column(db.Integer, nullable=False, default=1)
    amount = db.Column(db.Numeric(8, 2), nullable=False)
    order_date = db.Column(db.Date, nullable=False)
    ordered_for = db.Column(db.Date, nullable=False)
    payment_screenshot = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default="pending")      # pending | confirmed | rejected
    remarks = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship("User", backref="meal_orders")