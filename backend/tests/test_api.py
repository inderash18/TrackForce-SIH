import sys
import os
import unittest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token, verify_password, get_password_hash
from app.ml.inference import predict_project_risk, compute_engineered_features

from app.db.seed_data import init_and_seed_database

class TestPaimanaAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_and_seed_database()
        cls.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["service"], "PAIMANA Sentinel AI")

    def test_ready_endpoint(self):
        response = self.client.get("/ready")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ready")

    def test_auth_login(self):
        response = self.client.post(
            "/api/v1/auth/login",
            json={"email": "admin@mospi.gov.in", "password": "Paimana@2026"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["role"], "SUPER_ADMIN")

    def test_list_projects(self):
        response = self.client.get("/api/v1/projects")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("items", data)
        self.assertGreaterEqual(len(data["items"]), 1)
        self.assertGreaterEqual(data["total"], 1)

    def test_get_project_detail(self):
        response = self.client.get("/api/v1/projects/PRJ-2024-001")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], "PRJ-2024-001")
        self.assertIn("shap_drivers", data)
        self.assertIn("recommendations", data)

    def test_ml_prediction_and_shap(self):
        response = self.client.get("/api/v1/predictions/PRJ-2024-001")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("risk_score", data)
        self.assertIn("shap_drivers", data)
        self.assertGreater(len(data["shap_drivers"]), 0)

    def test_simulator(self):
        payload = {
            "project_id": "PRJ-2024-001",
            "land_acquisition_pct": 95.0,
            "contractor_performance": 4.8
        }
        response = self.client.post("/api/v1/simulator/simulate", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("baseline", data)
        self.assertIn("simulated", data)
        self.assertIn("deltas", data)
        # Higher land acquisition & contractor velocity should reduce risk
        self.assertLess(data["simulated"]["risk_score"], data["baseline"]["risk_score"])

    def test_early_warning_alerts(self):
        response = self.client.get("/api/v1/alerts")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)

    def test_analytics_overview(self):
        response = self.client.get("/api/v1/analytics/overview")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("total_projects", data)
        self.assertIn("risk_distribution", data)
        self.assertIn("top_critical_projects", data)

if __name__ == "__main__":
    unittest.main()
