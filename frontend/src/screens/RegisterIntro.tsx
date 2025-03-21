// frontend/src/screens/RegisterIntro.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/MNSR_logo.svg";

const RegisterIntro: React.FC = () => {
  const navigate = useNavigate();

  const handleApprove = () => {
    navigate("/register/phone");
  };

  return (
    <div className="screen-container">
      <img
        src={logo}
        alt="Manisr Logo"
        style={{ width: 80, marginBottom: 20 }}
      />
      <h2>Rברוכים הבאים למניש</h2>
      <p style={{ textAlign: "center", maxWidth: 300 }}>
        מניש הוא מיזם חברתי-סביבתי שמטרתו לצמצם זריקת מזון. החזון שלנו הוא להציל
        כל מנה או מוצר, כל עוד הם במצב טוב וראויים לאכילה. באמצעות האפליקציה
        ניתן הן למסור מזון והן לאסוף מזון בקרבתכם. מקווים שתמצאו את האפליקציה
        שימושית ונעימה. עם זאת, אנחנו תמיד שמחים לשמוע הצעות לשיפור, הערות
        והארות :)
      </p>

      <p>שלכם, צוות Rמניש</p>
      <button onClick={handleApprove} style={{ marginTop: 20 }}>
        Approve
      </button>
    </div>
  );
};

export default RegisterIntro;
