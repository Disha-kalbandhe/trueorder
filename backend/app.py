from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

MOCK_ORDERS = [
    {
        "id": "ord_001", "customer_name": "Sharma Traders", "customer_email": "sharma@traders.com",
        "status": "exception", "total_amount": 6000.0,
        "items": [{"sku": None, "raw_product_name": "Red Widget A1", "quantity": 50, "unit_price": 120.0, "matched_in_catalog": False}],
        "conflicts": [{"field": "quantity", "pdf_value": "100", "email_value": "50", "resolved_value": "50", "reason": "Email body overrides PDF per stated customer instruction"}],
        "created_at": "2026-07-07T09:00:00"
    },
    {
        "id": "ord_002", "customer_name": "Verma Distributors", "customer_email": "verma@dist.com",
        "status": "validated", "total_amount": 15400.0,
        "items": [{"sku": "SKU-221", "raw_product_name": "Steel Bracket B2", "quantity": 200, "unit_price": 77.0, "matched_in_catalog": True}],
        "conflicts": [], "created_at": "2026-07-07T08:30:00"
    },
    {
        "id": "ord_003", "customer_name": "Kapoor Retail", "customer_email": "kapoor@retail.com",
        "status": "confirmed", "total_amount": 3200.0,
        "items": [{"sku": "SKU-118", "raw_product_name": "Plastic Casing C3", "quantity": 40, "unit_price": 80.0, "matched_in_catalog": True}],
        "conflicts": [], "created_at": "2026-07-06T14:00:00"
    },
    {
        "id": "ord_004", "customer_name": "Global Traders", "customer_email": "global@traders.com",
        "status": "received", "total_amount": 9800.0,
        "items": [{"sku": None, "raw_product_name": "Copper Wire D4", "quantity": 100, "unit_price": 98.0, "matched_in_catalog": False}],
        "conflicts": [], "created_at": "2026-07-07T10:15:00"
    },
    {
        "id": "ord_005", "customer_name": "Sharma Traders", "customer_email": "sharma@traders.com",
        "status": "billed", "total_amount": 22000.0,
        "items": [{"sku": "SKU-330", "raw_product_name": "Industrial Motor E5", "quantity": 10, "unit_price": 2200.0, "matched_in_catalog": True}],
        "conflicts": [], "created_at": "2026-07-05T11:00:00"
    },
]

@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "status": "ok",
        "service": "TrueOrder backend",
        "endpoints": ["/health", "/api/orders", "/api/orders/<id>"]
    }), 200

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "service": "TrueOrder backend"}), 200

@app.route("/api/orders", methods=["GET"])
def get_orders():
    return jsonify(MOCK_ORDERS), 200

@app.route("/api/orders/<order_id>", methods=["GET"])
def get_order_detail(order_id):
    order = next((o for o in MOCK_ORDERS if o["id"] == order_id), None)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(order), 200

@app.route("/api/orders/<order_id>/status", methods=["PATCH"])
def update_status(order_id):
    order = next((o for o in MOCK_ORDERS if o["id"] == order_id), None)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    order["status"] = request.json.get("status", order["status"])
    return jsonify(order), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)