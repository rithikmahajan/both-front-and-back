import React, { useState } from 'react';

// Asset imports - these would typically be in a proper assets folder
const assets = {
  iconSVG: "http://localhost:3845/assets/c72dbca3d7c567f025d4fe65163f0d0ae35ae9e2.svg",
  subtractSVG: "http://localhost:3845/assets/28bcf364dbda62f09ff4ee8b42066c4641ce2575.svg",
  dotSVG: "http://localhost:3845/assets/f8ca3f1d6d30b0b540c05804372fe22cd04a9441.svg",
  closeSVG: "http://localhost:3845/assets/74400e78448b85fb9710d100c8cbcbe664fe30de.svg",
  verificationCircles: "http://localhost:3845/assets/c95217693da0fff29202ef80dd573a52a88641c1.svg",
  underlineSVG: "http://localhost:3845/assets/1e2eb83a17f931aa65256b9d07fdabb42f2c65ae.svg",
  eyeBaseSVG: "http://localhost:3845/assets/2ebf1b4d037f823ffce000f6c3337e8e5e87221b.svg",
  eyeOutlineSVG: "http://localhost:3845/assets/cda12aaac3c1957ae4507f6e05a1478b9ff2a33f.svg",
  eyeCenterSVG: "http://localhost:3845/assets/95d3ba91a7136ae5b20f98144a4f68792182265b.svg",
  warningCheckSVG: "http://localhost:3845/assets/f919a2a6dd8ca653123b059a97bee77e91d596f9.svg",
  successCheckSVG: "http://localhost:3845/assets/e5678a3b8326a52250be1683e841fedf9f641617.svg"
};

// Confirmation Dialog Component
export function ConfirmationDialog({ onClose, onConfirm, message = "are you sure you want to turn this off" }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white overflow-hidden relative rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-[400px] h-[280px]"
        data-name="Confirmation Dialog"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[20px] top-[20px] w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity"
          data-name="Cancel Icon"
        >
          <img 
            alt="Close" 
            className="w-full h-full" 
            src={assets.closeSVG} 
          />
        </button>

        {/* Message */}
        <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[300px]">
          <h2 className="font-montserrat font-bold text-lg text-black text-center leading-[22px] tracking-[-0.41px]">
            {message}
          </h2>
        </div>

        {/* Button Container */}
        <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 flex gap-4">
          {/* Yes Button */}
          <button
            onClick={onConfirm}
            className="bg-black text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full hover:bg-gray-800 transition-colors min-w-[100px]"
          >
            yes
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="bg-transparent text-black font-montserrat font-medium text-base px-8 py-3 rounded-full border border-[#e4e4e4] hover:bg-gray-50 transition-colors min-w-[100px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Turn On Confirmation Dialog Component
export function TurnOnConfirmationDialog({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white overflow-hidden relative rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-[400px] h-[280px]"
        data-name="Turn On Confirmation Dialog"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[20px] top-[20px] w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity"
          data-name="Cancel Icon"
        >
          <img 
            alt="Close" 
            className="w-full h-full" 
            src={assets.closeSVG} 
          />
        </button>

        {/* Message */}
        <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[300px]">
          <h2 className="font-montserrat font-bold text-lg text-black text-center leading-[22px] tracking-[-0.41px]">
            are you sure you want to turn this on
          </h2>
        </div>

        {/* Button Container */}
        <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 flex gap-4">
          {/* Yes Button */}
          <button
            onClick={onConfirm}
            className="bg-black text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full hover:bg-gray-800 transition-colors min-w-[100px]"
          >
            yes
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="bg-transparent text-black font-montserrat font-medium text-base px-8 py-3 rounded-full border border-[#e4e4e4] hover:bg-gray-50 transition-colors min-w-[100px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Dialog Component
export function DeleteConfirmationDialog({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white overflow-hidden relative rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-[400px] h-[320px]"
        data-name="Delete Confirmation Dialog"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[20px] top-[20px] w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <img 
            alt="Close" 
            className="w-full h-full" 
            src={assets.closeSVG} 
          />
        </button>

        {/* Warning Icon */}
        <div className="absolute top-[40px] left-1/2 transform -translate-x-1/2 w-16 h-16">
          <img 
            alt="Warning" 
            className="w-full h-full" 
            src={assets.warningCheckSVG} 
          />
        </div>

        {/* Message */}
        <div className="absolute top-[120px] left-1/2 transform -translate-x-1/2 w-[300px]">
          <h2 className="font-montserrat font-bold text-lg text-black text-center leading-[22px] tracking-[-0.41px]">
            are you sure you want to delete this
          </h2>
        </div>

        {/* Button Container */}
        <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 flex gap-4">
          {/* Yes Button */}
          <button
            onClick={onConfirm}
            className="bg-black text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full hover:bg-gray-800 transition-colors min-w-[100px]"
          >
            yes
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="bg-transparent text-black font-montserrat font-medium text-base px-8 py-3 rounded-full border border-[#e4e4e4] hover:bg-gray-50 transition-colors min-w-[100px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Success Dialog Component (Generic)
export function SuccessDialog({ onClose, message = "Success!" }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white overflow-hidden relative rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-[400px] h-[300px]"
        data-name="Success Dialog"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[20px] top-[20px] w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <img 
            alt="Close" 
            className="w-full h-full" 
            src={assets.closeSVG} 
          />
        </button>

        {/* Success Icon */}
        <div className="absolute top-[50px] left-1/2 transform -translate-x-1/2 w-16 h-16">
          <img 
            alt="Success" 
            className="w-full h-full" 
            src={assets.successCheckSVG} 
          />
        </div>

        {/* Message */}
        <div className="absolute top-[130px] left-1/2 transform -translate-x-1/2 w-[320px]">
          <h2 className="font-montserrat font-bold text-lg text-black text-center leading-[22px] tracking-[-0.41px]">
            {message}
          </h2>
        </div>

        {/* Done Button */}
        <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2">
          <button
            onClick={onClose}
            className="bg-black text-white font-montserrat font-semibold text-base px-16 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ID Verified Successfully Dialog
export function IDVerifiedDialog({ onClose }) {
  return (
    <SuccessDialog 
      onClose={onClose} 
      message="id verified successfully!" 
    />
  );
}

// Item Deleted Successfully Dialog
export function ItemDeletedDialog({ onClose }) {
  return (
    <SuccessDialog 
      onClose={onClose} 
      message="Item deleted successfully!" 
    />
  );
}

// Item Details Updated Successfully Dialog
export function ItemUpdatedDialog({ onClose }) {
  return (
    <SuccessDialog 
      onClose={onClose} 
      message="Item details updated successfully!" 
    />
  );
}

// Item Saved Successfully Dialog
export function ItemSavedDialog({ onClose }) {
  return (
    <SuccessDialog 
      onClose={onClose} 
      message="Item saved successfully!" 
    />
  );
}

// Two Factor Verification Modal Component
export function TwoFactorVerificationModal({ onClose, onSubmit }) {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [emailCode, setEmailCode] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [showDefaultPassword, setShowDefaultPassword] = useState(false);

  const handleVerificationCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = () => {
    const codeString = verificationCode.join('');
    if (onSubmit) {
      onSubmit({
        phoneVerificationCode: codeString,
        emailVerificationCode: emailCode,
        password: password
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white overflow-hidden relative rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-[448px] h-[634px]"
        data-name="Notification Form"
      >
        {/* Notification Icon */}
        <div className="absolute left-[439px] w-[35px] h-[35px] top-[849px]">
          <div className="absolute inset-[12.5%]">
            <div className="absolute inset-[-3.81%]">
              <img
                alt="Notification icon"
                className="block max-w-none w-full h-full"
                loading="lazy"
                src={assets.iconSVG}
              />
            </div>
          </div>
          <div className="absolute bottom-[31.84%] left-[20.83%] right-[20.84%] top-[39.59%]">
            <img
              alt="Subtract"
              className="block max-w-none w-full h-full"
              loading="lazy"
              src={assets.subtractSVG}
            />
          </div>
          <div className="absolute bottom-[62.5%] left-[62.5%] right-1/4 top-1/4">
            <img
              alt="Dot"
              className="block max-w-none w-full h-full"
              loading="lazy"
              src={assets.dotSVG}
            />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[33px] top-[33px] w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity"
          data-name="Close Button"
        >
          <img 
            alt="Close" 
            className="w-full h-full" 
            src={assets.closeSVG} 
          />
        </button>

        {/* Title */}
        <div className="absolute top-[47px] left-1/2 transform -translate-x-1/2 w-[408px]">
          <h1 className="font-montserrat font-bold text-2xl text-black text-center leading-[22px] tracking-[-0.41px]">
            Two Factor Verification
          </h1>
        </div>

        {/* Phone Verification Section */}
        <div className="absolute left-[69px] top-[100px] flex flex-col gap-2">
          <div className="relative">
            <h2 className="font-montserrat font-bold text-2xl text-black tracking-[0.72px] leading-[48px] w-[225px] h-[42px]">
              Verification code
            </h2>
          </div>
          <div className="w-[308px]">
            <p className="font-montserrat text-sm text-black leading-6">
              Please enter the verification code we sent to your phone number
            </p>
          </div>
        </div>

        {/* Verification Code Input Circles */}
        <div className="absolute left-[84px] top-[214px] w-[268px] h-[58px]">
          <div className="flex gap-4 items-center justify-between w-full">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                className="w-[58px] h-[58px] border-2 border-black rounded-full text-center text-xl font-semibold focus:border-black focus:outline-none bg-white"
              />
            ))}
          </div>
        </div>

        {/* Email Verification Section */}
        <div className="absolute left-[73px] top-[320px] w-[308px]">
          <p className="font-montserrat text-sm text-black leading-6">
            Please enter the verification code we sent to your email address
          </p>
        </div>

        {/* Email Verification Input */}
        <div className="absolute left-[69px] top-[346px] flex flex-col gap-5">
          <div className="relative w-[310px] h-[50px]">
            <input
              type={showEmailPassword ? 'text' : 'password'}
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
              placeholder="Password"
              className="w-full h-full border-0 border-b-2 border-gray-300 bg-transparent text-base placeholder-[#BDBCBC] focus:border-black focus:outline-none tracking-[0.32px] leading-6"
              style={{ fontFamily: 'Mulish, sans-serif', fontWeight: 400 }}
            />
            <button
              type="button"
              onClick={() => setShowEmailPassword(!showEmailPassword)}
              className="absolute right-0 top-[14px] w-6 h-6 cursor-pointer"
            >
              <div className="relative w-full h-full">
                <img alt="Eye base" className="absolute inset-0 w-full h-full" src={assets.eyeBaseSVG} />
                <div className="absolute bottom-[21.88%] left-[6.25%] right-[6.25%] top-[21.88%]">
                  <img alt="Eye outline" className="w-full h-full" src={assets.eyeOutlineSVG} />
                </div>
                <div className="absolute inset-[34.375%]">
                  <img alt="Eye center" className="w-full h-full" src={assets.eyeCenterSVG} />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Default Password Section */}
        <div className="absolute left-[70px] top-[526px] w-[308px]">
          <p className="font-montserrat text-sm text-black leading-6">
            Please enter the default password .
          </p>
        </div>

        {/* Default Password Input */}
        <div className="absolute left-[69px] top-[444px] flex flex-col gap-5">
          <div className="relative w-[310px] h-[50px]">
            <input
              type={showDefaultPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-full border-0 border-b-2 border-gray-300 bg-transparent text-base placeholder-[#BDBCBC] focus:border-black focus:outline-none tracking-[0.32px] leading-6"
              style={{ fontFamily: 'Mulish, sans-serif', fontWeight: 400 }}
            />
            <button
              type="button"
              onClick={() => setShowDefaultPassword(!showDefaultPassword)}
              className="absolute right-0 top-[14px] w-6 h-6 cursor-pointer"
            >
              <div className="relative w-full h-full">
                <img alt="Eye base" className="absolute inset-0 w-full h-full" src={assets.eyeBaseSVG} />
                <div className="absolute bottom-[21.88%] left-[6.25%] right-[6.25%] top-[21.88%]">
                  <img alt="Eye outline" className="w-full h-full" src={assets.eyeOutlineSVG} />
                </div>
                <div className="absolute inset-[34.375%]">
                  <img alt="Eye center" className="w-full h-full" src={assets.eyeCenterSVG} />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="absolute left-[63px] top-[542px] w-[310px] h-[51px]">
          <button
            onClick={handleSubmit}
            className="w-full h-full bg-black rounded-[26.5px] hover:bg-gray-800 transition-colors"
          >
            <span className="font-montserrat font-bold text-base text-white uppercase leading-6">
              SUBMIT
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Export both components
export default TwoFactorVerificationModal;
