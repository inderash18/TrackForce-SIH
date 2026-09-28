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

    def test_ministry_scoped_access_control(self):
        # 1. Login as Railways Officer
        railways_login = self.client.post(
            "/api/v1/auth/login",
            json={"email": "railways.officer@gov.in", "password": "Paimana@2026"}
        )
        self.assertEqual(railways_login.status_code, 200)
        railways_token = railways_login.json()["access_token"]
        railways_headers = {"Authorization": f"Bearer {railways_token}"}

        # 2. Query projects list - must ONLY return Railways projects
        scoped_projects_res = self.client.get("/api/v1/projects", headers=railways_headers)
        self.assertEqual(scoped_projects_res.status_code, 200)
        scoped_data = scoped_projects_res.json()
        self.assertGreaterEqual(scoped_data["total"], 1)
        for item in scoped_data["items"]:
            self.assertIn("Railways", item["ministry"])

        # 3. Railways officer accesses Railways project (PRJ-2024-001) -> 200 OK
        railways_prj_res = self.client.get("/api/v1/projects/PRJ-2024-001", headers=railways_headers)
        self.assertEqual(railways_prj_res.status_code, 200)
        self.assertEqual(railways_prj_res.json()["ministry"], "Ministry of Railways")

        # 4. Railways officer attempts to access MoRTH project (PRJ-2024-002) -> 403 Forbidden
        forbidden_res = self.client.get("/api/v1/projects/PRJ-2024-002", headers=railways_headers)
        self.assertEqual(forbidden_res.status_code, 403)
        self.assertIn("detail", forbidden_res.json())

        # 5. Query alerts - must ONLY return Railways alerts
        scoped_alerts_res = self.client.get("/api/v1/alerts", headers=railways_headers)
        self.assertEqual(scoped_alerts_res.status_code, 200)
        scoped_alerts = scoped_alerts_res.json()
        for alert in scoped_alerts:
            self.assertIn("Railways", alert["ministry"])

        # 6. Login as National Admin (MoSPI) -> Has oversight across all ministries
        admin_login = self.client.post(
            "/api/v1/auth/login",
            json={"email": "admin@mospi.gov.in", "password": "Paimana@2026"}
        )
        self.assertEqual(admin_login.status_code, 200)
        admin_token = admin_login.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}

        # National Admin accesses MoRTH project -> 200 OK
        morth_as_admin = self.client.get("/api/v1/projects/PRJ-2024-002", headers=admin_headers)
        self.assertEqual(morth_as_admin.status_code, 200)
        self.assertIn("Road Transport", morth_as_admin.json()["ministry"])

    def test_ministry_scoped_analytics_and_exports(self):
        # 1. Railways Officer Auth
        railways_login = self.client.post(
            "/api/v1/auth/login",
            json={"email": "railways.officer@gov.in", "password": "Paimana@2026"}
        )
        self.assertEqual(railways_login.status_code, 200)
        railways_token = railways_login.json()["access_token"]
        railways_headers = {"Authorization": f"Bearer {railways_token}"}

        # 2. Analytics overview must be scoped to Railways
        r_analytics = self.client.get("/api/v1/analytics/overview", headers=railways_headers)
        self.assertEqual(r_analytics.status_code, 200)
        r_data = r_analytics.json()
        self.assertGreater(r_data["total_projects"], 0)
        for min_stat in r_data.get("ministry_breakdown", []):
            self.assertIn("Railways", min_stat["ministry"])

        # 3. CSV export must contain only Railways projects
        r_export = self.client.get("/api/v1/reports/export/csv", headers=railways_headers)
        self.assertEqual(r_export.status_code, 200)
        export_text = r_export.text
        self.assertIn("Ministry of Railways", export_text)
        # Should NOT contain foreign ministry lines
        for line in export_text.splitlines()[1:]:
            if line.strip():
                self.assertIn("Railways", line)

        # 4. MoRTH Officer Auth
        morth_login = self.client.post(
            "/api/v1/auth/login",
            json={"email": "morth.officer@gov.in", "password": "Paimana@2026"}
        )
        self.assertEqual(morth_login.status_code, 200)
        morth_token = morth_login.json()["access_token"]
        morth_headers = {"Authorization": f"Bearer {morth_token}"}

        # MoRTH CSV export should only contain Road Transport & Highways
        m_export = self.client.get("/api/v1/reports/export/csv", headers=morth_headers)
        self.assertEqual(m_export.status_code, 200)
        for line in m_export.text.splitlines()[1:]:
            if line.strip():
                self.assertIn("Road Transport", line)

    def test_forged_scope_rejection_and_data_import_boundary(self):
        # 1. Railways Officer Auth
        railways_login = self.client.post(
            "/api/v1/auth/login",
            json={"email": "railways.officer@gov.in", "password": "Paimana@2026"}
        )
        railways_token = railways_login.json()["access_token"]
        railways_headers = {"Authorization": f"Bearer {railways_token}"}

        # 2. Forged ministry query param should return 403 Forbidden
        forged_res = self.client.get(
            "/api/v1/projects?ministry=Ministry%20of%20Road%20Transport%20and%20Highways",
            headers=railways_headers
        )
        self.assertEqual(forged_res.status_code, 403)

        # 3. Validating a CSV with foreign ministry rows as Railways officer should flag error
        unauthorized_csv = (
            "code,name,ministry,sector,state,district,implementing_agency,original_cost,revised_cost,expenditure,original_completion,revised_completion,physical_progress,expected_progress,contractor_rating,land_acquisition_pct,forest_clearance_status,environment_clearance_status,latitude,longitude\n"
            "PRJ-UNAUTH-01,Unauthorized Highway Bypass,Ministry of Road Transport & Highways,Roads & Highways,Karnataka,Bengaluru,NHAI,3200.0,3400.0,1200.0,2027-06-30,2027-12-31,35.0,45.0,4.0,80.0,Approved,Approved,12.9716,77.5946\n"
        )
        files = {"file": ("unauthorized_test.csv", unauthorized_csv.encode("utf-8"), "text/csv")}
        val_res = self.client.post("/api/v1/data/validate", files=files, headers=railways_headers)
        self.assertEqual(val_res.status_code, 200)
        val_data = val_res.json()
        self.assertGreater(val_data["error_count"], 0)
        self.assertIn("outside your authorized scope", str(val_data["errors"]))

    def test_assistant_chat_ministry_scoped(self):
        railways_login = self.client.post(
            "/api/v1/auth/login",
            json={"email": "railways.officer@gov.in", "password": "Paimana@2026"}
        )
        railways_token = railways_login.json()["access_token"]
        railways_headers = {"Authorization": f"Bearer {railways_token}"}

        chat_payload = {
            "messages": [{"role": "user", "content": "What is the status of projects needing attention?"}],
            "project_id": "PRJ-2024-001"
        }
        chat_res = self.client.post("/api/v1/assistant/chat", json=chat_payload, headers=railways_headers)
        self.assertEqual(chat_res.status_code, 200)
        chat_data = chat_res.json()
        self.assertIn("reply", chat_data)
        self.assertIn("suggested_questions", chat_data)

if __name__ == "__main__":
    unittest.main()



