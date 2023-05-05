import "./phone.css";
import { useState, useRef } from "react";

function PhoneVerificationPopup() {
  const [otp, setOtp] = useState("");
  const [open, setOpen] = useState(false);
  const inputRefs = useRef([]);

  const handleInputChange = (e, inputIndex) => {
    const value = e.target.value.replace(/\D/g, ""); // remove non-numeric characters
    if (value.length <= 1) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[inputIndex] = value;
        return newOtp.join("");
      });
      if (value.length === 1 && inputIndex < inputRefs.current.length - 1) {
        inputRefs.current[inputIndex + 1].focus();
      } else if (value.length === 0 && inputIndex > 0) {
        inputRefs.current[inputIndex - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const pastedOtp = pastedData.replace(/\D/g, "").slice(0, 6); // remove non-numeric characters and limit to 6 digits
    setOtp(pastedOtp.padEnd(6, "0").slice(0, 6)); // pad with zeros if pasted OTP is less than 6 digits
    inputRefs.current.forEach((ref, index) => {
      if (pastedOtp[index]) {
        ref.value = pastedOtp[index];
      } else {
        ref.value = "";
      }
    });
  };

  const handleKeyDown = (e, inputIndex) => {
    if (e.key === "ArrowLeft" && inputIndex > 0) {
      inputRefs.current[inputIndex - 1].focus();
    } else if (
      e.key === "ArrowRight" &&
      inputIndex < inputRefs.current.length - 1
    ) {
      inputRefs.current[inputIndex + 1].focus();
    } else if (e.key === "Backspace" && !inputRefs.current[inputIndex].value) {
      inputRefs.current[inputIndex - 1].focus();
    }
  };

  return (
    <>
      <button
        style={{ display: !open ? "block" : "none",margin:"5px auto"  }}
        onClick={() => {
          setOtp("");
          setOpen(true);
        }}
      >
        Verify Phone
      </button>
      <div className="popup" style={{ display: open ? "block" : "none"}}>
        <h3>Enter OTP</h3>
        <div className="otp-inputs">
          {[...Array(6)].map((_, index) => (
            <input
              type="tel"
              maxLength="1"
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={otp[index] || ""}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
            />
          ))}
        </div>
      </div>
      <div  style={{ display: open ? "block" : "none" }}>
      <div className="option">
        <div>Change Number</div>
        <div>Re-send OTP</div>
      </div>
      <div>
        <button type="submit">Verify Phone Number</button>
      </div>
      </div>
    </>
  );
}

export default PhoneVerificationPopup;
