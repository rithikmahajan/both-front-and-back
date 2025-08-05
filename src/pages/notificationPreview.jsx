// NotificationPreview page displays the uploaded notification image in full view
// Uses React Router location state to receive image data
// Usage: Navigate to this page with image in location.state
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// NotificationPreview page to show the uploaded image in full view
const NotificationPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get image from navigation state
  const image = location.state?.image;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      {/* Back icon at top right of content area */}
      <button
        className="absolute top-6 right-8 bg-black text-white p-2 rounded-full flex items-center justify-center hover:bg-gray-800"
        onClick={() => navigate(-1)}
        title="Back"
      >
        <ArrowLeft size={20} />
      </button>
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          Notification Image Preview
        </h2>
        {image ? (
          <img
            src={image}
            alt="Notification Full Preview"
            className="max-w-2xl rounded-lg border border-gray-300"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            No image uploaded
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPreview;
