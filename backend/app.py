from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "service": "TrueOrder backend"}), 200

@app.route("/api/orders", methods=["GET"])
def get_orders_mock():
    # Temporary mock data matching schemas.py — replace in Week 2
    return jsonify([
        {
            "id": "ord_001",
            "customer_name": "Sharma Traders",
            "customer_email": "sharma@traders.com",
            "status": "exception",
            "items": [
                {"sku": None, "raw_product_name": "Red Widget A1", "quantity": 50, "unit_price": 120.0, "matched_in_catalog": False}
            ],
            "conflicts": [
                {"field": "quantity", "pdf_value": "100", "email_value": "50", "resolved_value": "50", "reason": "Email body overrides PDF per stated customer instruction"}
            ],
            "total_amount": 6000.0
        }
    ]), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)