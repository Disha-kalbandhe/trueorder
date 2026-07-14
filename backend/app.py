from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

MOCK_ORDERS = [
    {
        "id": "ord_001",
        "customer_name": "Sharma Traders",
        "customer_email": "sharma@traders.com",
        "status": "exception",
        "total_amount": 6000.0,
        "email_subject": "Re: PO 4482 - Please reduce Red Widget A1 quantity",
        "email_body": "Hi team, please update the attached order to 50 units of Red Widget A1 instead of 100. The customer confirmed the reduced quantity by email after reviewing stock levels. Ship this revised quantity only.",
        "attachment_name": "PO_4482_Sharma_Traders.pdf",
        "attachment_type": "application/pdf",
        "extracted_attachment_text": "Purchase Order 4482. Product: Red Widget A1. Quantity: 100 units. Unit price: 120.00. Delivery to: Sharma Traders, Bhiwandi warehouse.",
        "processing_confidence": 0.84,
        "decision_summary": "The PDF listed 100 units, but the email explicitly requested 50 units, so the system applied email intent and flagged the order for review.",
        "items": [
            {
                "sku": None,
                "raw_product_name": "Red Widget A1",
                "quantity": 50,
                "unit_price": 120.0,
                "matched_in_catalog": False,
            }
        ],
        "conflicts": [
            {
                "field": "quantity",
                "pdf_value": "100",
                "email_value": "50",
                "resolved_value": "50",
                "reason": "Email body overrides PDF per stated customer instruction",
            }
        ],
        "created_at": "2026-07-07T09:00:00",
    },
    {
        "id": "ord_002",
        "customer_name": "Verma Distributors",
        "customer_email": "verma@dist.com",
        "status": "validated",
        "total_amount": 15400.0,
        "email_subject": "PO 7710 - Steel Bracket B2 order confirmation",
        "email_body": "Please confirm 200 units of Steel Bracket B2 at the agreed distributor rate. No changes from the attached purchase order.",
        "attachment_name": "Verma_Distributors_PO_7710.pdf",
        "attachment_type": "application/pdf",
        "extracted_attachment_text": "Purchase Order 7710. Product: Steel Bracket B2. Quantity: 200. Unit price: 77.00. Terms: net 30. Delivery: Nashik distribution center.",
        "processing_confidence": 0.97,
        "decision_summary": "Email and PDF matched on product, quantity, and price, so the system accepted the attachment without overrides.",
        "items": [
            {
                "sku": "SKU-221",
                "raw_product_name": "Steel Bracket B2",
                "quantity": 200,
                "unit_price": 77.0,
                "matched_in_catalog": True,
            }
        ],
        "conflicts": [],
        "created_at": "2026-07-07T08:30:00",
    },
    {
        "id": "ord_003",
        "customer_name": "Kapoor Retail",
        "customer_email": "kapoor@retail.com",
        "status": "confirmed",
        "total_amount": 3200.0,
        "email_subject": "Re: Fragile parts order for Kapoor Retail",
        "email_body": "Please proceed with 40 units of Plastic Casing C3. The order is unchanged from the PDF and approved for dispatch this week.",
        "attachment_name": "Kapoor_Retail_Feb_Order.pdf",
        "attachment_type": "application/pdf",
        "extracted_attachment_text": "Order memo. Product: Plastic Casing C3. Quantity: 40. Unit price: 80.00. Ship to Kapoor Retail, Pune.",
        "processing_confidence": 0.99,
        "decision_summary": "No contradiction was detected; the attachment and email aligned completely, so the order moved to confirmed.",
        "items": [
            {
                "sku": "SKU-118",
                "raw_product_name": "Plastic Casing C3",
                "quantity": 40,
                "unit_price": 80.0,
                "matched_in_catalog": True,
            }
        ],
        "conflicts": [],
        "created_at": "2026-07-06T14:00:00",
    },
    {
        "id": "ord_004",
        "customer_name": "Global Traders",
        "customer_email": "global@traders.com",
        "status": "received",
        "total_amount": 9800.0,
        "email_subject": "New order request - Copper Wire D4 urgent replenishment",
        "email_body": "Please reserve 100 units of Copper Wire D4 for dispatch next week. If this SKU is not available under the current code, please route it to repair for catalog review.",
        "attachment_name": "Global_Traders_Stock_Request.pdf",
        "attachment_type": "application/pdf",
        "extracted_attachment_text": "Supplier request. Product described as Copper Wire D4. Quantity 100. Unit price 98.00. No matching catalog SKU found in the attachment metadata.",
        "processing_confidence": 0.73,
        "decision_summary": "The order extracted cleanly, but the product could not be matched to a catalog SKU, so it remains open for repair workflow.",
        "items": [
            {
                "sku": None,
                "raw_product_name": "Copper Wire D4",
                "quantity": 100,
                "unit_price": 98.0,
                "matched_in_catalog": False,
            }
        ],
        "conflicts": [],
        "created_at": "2026-07-07T10:15:00",
    },
    {
        "id": "ord_005",
        "customer_name": "Sharma Traders",
        "customer_email": "sharma@traders.com",
        "status": "billed",
        "total_amount": 22000.0,
        "email_subject": "Final confirmation - Industrial Motor E5 batch dispatch",
        "email_body": "Please invoice and ship 10 units of Industrial Motor E5. The shipment was confirmed over email after the earlier quotation was accepted.",
        "attachment_name": "Sharma_Traders_Final_Approval.pdf",
        "attachment_type": "application/pdf",
        "extracted_attachment_text": "Approved order. Product: Industrial Motor E5. Quantity: 10. Unit price: 2200.00. Bill to Sharma Traders corporate account.",
        "processing_confidence": 0.98,
        "decision_summary": "The email and attachment matched, the order was validated, and billing was completed with no exceptions.",
        "items": [
            {
                "sku": "SKU-330",
                "raw_product_name": "Industrial Motor E5",
                "quantity": 10,
                "unit_price": 2200.0,
                "matched_in_catalog": True,
            }
        ],
        "conflicts": [],
        "created_at": "2026-07-05T11:00:00",
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