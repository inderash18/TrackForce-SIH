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

    def test_data_template_download(self):
        response = self.client.get("/api/v1/data/template")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["content-type"], "text/csv; charset=utf-8")
        self.assertIn("code,name,ministry,sector", response.text)

    def test_data_validate_and_import(self):
        csv_data = (
            "code,name,ministry,sector,state,district,implementing_agency,original_cost,revised_cost,expenditure,original_completion,revised_completion,physical_progress,expected_progress,contractor_rating,land_acquisition_pct,forest_clearance_status,environment_clearance_status,latitude,longitude\n"
            "PRJ-TEST-999,Test Automated Metro Line,Ministry of Housing and Urban Affairs,Urban Development,Karnataka,Bengaluru,BMRCL,8500.0,9200.0,4200.0,2027-06-30,2027-12-31,45.0,55.0,4.2,92.0,Approved,Approved,12.9716,77.5946\n"
        )
        files = {"file": ("test_import.csv", csv_data.encode("utf-8"), "text/csv")}
        
        # Test Validate
        val_response = self.client.post("/api/v1/data/validate", files=files)
        self.assertEqual(val_response.status_code, 200)
        val_data = val_response.json()
        self.assertEqual(val_data["valid_rows"], 1)
        self.assertEqual(val_data["error_count"], 0)

        # Test Import
        files_import = {"file": ("test_import.csv", csv_data.encode("utf-8"), "text/csv")}
        imp_response = self.client.post("/api/v1/data/import", files=files_import)
        self.assertEqual(imp_response.status_code, 200)
        imp_data = imp_response.json()
        self.assertTrue(imp_data["success"])
        self.assertGreaterEqual(imp_data["imported_new"] + imp_data["updated_existing"], 1)

        # Verify ingested project in database
        proj_resp = self.client.get("/api/v1/projects/PRJ-TEST-999")
        self.assertEqual(proj_resp.status_code, 200)
        p_data = proj_resp.json()
        self.assertEqual(p_data["code"], "PRJ-TEST-999")
        self.assertIn("risk_score", p_data)

    def test_project_create_and_patch(self):
        import uuid
        test_code = f"PRJ-TEST-{uuid.uuid4().hex[:6].upper()}"
        create_payload = {
            "code": test_code,
            "name": "Integration Test Solar Park",
            "ministry": "Ministry of New and Renewable Energy",
            "sector": "Power",
            "state": "Rajasthan",
            "implementing_agency": "SECI",
            "original_cost": 3000.0,
            "revised_cost": 3200.0,
            "expenditure": 1500.0,
            "physical_progress": 50.0,
            "expected_progress": 60.0
        }
        res = self.client.post("/api/v1/projects", json=create_payload)
        self.assertEqual(res.status_code, 201)
        p = res.json()
        self.assertEqual(p["code"], test_code)
        self.assertGreater(p["risk_score"], 0)

        # Patch project
        patch_res = self.client.patch(f"/api/v1/projects/{test_code}", json={"physical_progress": 65.0})
        self.assertEqual(patch_res.status_code, 200)
        patched_p = patch_res.json()
        self.assertEqual(patched_p["physical_progress"], 65.0)

if __name__ == "__main__":
    unittest.main()

