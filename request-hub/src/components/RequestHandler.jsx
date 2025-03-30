import { useState } from "react";
import { db, collection, addDoc, serverTimestamp, auth } from "../firebase/firebase";
import useMaintenanceRequests from "./hooks/useMaintenanceRequests";
import useSupplyRequests from "./hooks/useSupplyRequests";

export default function RequestHandler() {
  const [requestType, setRequestType] = useState(null);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isAnonymous: false,
    supplyType: "",
    supplyName: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maintenanceRequests = useMaintenanceRequests();
  const supplyRequests = useSupplyRequests();

  const validateForm = () => {
    let newErrors = {};
    if (requestType === "maintenance") {
      if (!formData.title.trim()) newErrors.title = "Title is required.";
      if (!formData.description.trim()) newErrors.description = "Description is required.";
    }
    if (requestType === "suggestion") {
      if (!formData.description.trim()) newErrors.description = "Suggestion is required.";
    }
    if (requestType === "supply") {
      if (!formData.supplyType) newErrors.supplyType = "Select a supply type.";
      if (!formData.supplyName.trim()) newErrors.supplyName = "Supply name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    if (!validateForm()) {
      // Show error message if form is invalid
      alert("Please fill out all required fields.");
      return;
    }

    if (!auth.currentUser) {
      alert("Please sign in first.");
      return;
    }

    setIsSubmitting(true);
    const user = auth.currentUser;
    
    // Handle anonymous submissions
    const requestData = {
      type: requestType,
      title: formData.title || "",
      description: formData.description || "",
      isAnonymous: formData.isAnonymous || false,
      category: formData.supplyType || "",
      itemName: formData.supplyName || "",
      timestamp: serverTimestamp(),
      status: "pending",
      quantity: 0
    };
    
    // Only include user information if not anonymous
    if (formData.isAnonymous && requestType === "suggestion") {
      requestData.userId = "anonymous";
      requestData.userName = "Anonymous";
      requestData.userEmail = "anonymous";
    } else {
      requestData.userId = user.uid;
      requestData.userName = user.displayName;
      requestData.userEmail = user.email;
    }

    try {
      await addDoc(collection(db, "requests"), requestData);
      alert("Request submitted successfully!");
      // Reset form
      setFormData({
        title: "",
        description: "",
        isAnonymous: false,
        supplyType: "",
        supplyName: "",
        quantity: 0
      });
      setRequestType(null);
      setStep(0);
    } catch (error) {
      console.error("Error adding request: ", error);
      alert("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-container w-full max-w-3xl min-h-[500px] rounded-2xl p-8 flex flex-col justify-evenly items-center transition-all text-white md:w-4/5 sm:w-full">
      {step === 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">What type of request?</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {["maintenance", "suggestion", "supply"].map((type) => (
              <div
              key={type}
              className={`w-40 h-40 glass-container flex items-center justify-center text-lg font-bold cursor-pointer transition-all duration-300 ${
                requestType === type
                  ? "glass-container-selected scale-110" // Selected: bolder border, darker bg, larger container
                  : "hover:shadow-[0_0_10px_rgba(255,255,255,0.4)]" // Unselected: hover shadow
              }`}
              onClick={() => setRequestType(type)}
            >
                <div className={`transition-all duration-300 ${
                  requestType === type ? "text-2xl" : "text-xl"
                }`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
              </div>
            ))}
          </div>
          <button
            className={`mt-8 px-8 py-4 text-lg font-semibold rounded-lg transition-all ${
              requestType 
                ? "bg-blue-500 hover:bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]" 
                : "bg-blue-500/50 cursor-not-allowed"
            }`}
            disabled={!requestType}
            onClick={() => setStep(1)}
          >
            Next
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Fill in the details for your {requestType} request
          </h2>

          <div className="w-full flex flex-col gap-6">
            {requestType === "maintenance" && (
              <>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (errors.title) {
                        setErrors({ ...errors, title: "" });
                      }
                    }}
                    className={`p-4 glass-container text-white rounded-md w-full text-lg transition-all ${
                      errors.title 
                        ? "ring-2 ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                        : formData.title 
                          ? "ring-2 ring-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                          : ""
                    }`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div className="w-full">
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) {
                        setErrors({ ...errors, description: "" });
                      }
                    }}
                    className={`p-4 glass-container text-white rounded-md w-full text-lg h-40 transition-all ${
                      errors.description 
                        ? "ring-2 ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                        : formData.description 
                          ? "ring-2 ring-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                          : ""
                    }`}
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {maintenanceRequests.length > 0 && (
                  <div className="w-full max-h-40 overflow-y-auto glass-container p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-2">Existing Requests:</h3>
                    {maintenanceRequests.map((req) => (
                      <div key={req.id} className="glass-container p-3 rounded-lg mb-2">
                        <p className="text-white font-bold">{req.title}</p>
                        <p className="text-gray-300 text-sm">{req.description}</p>
                        <span className="text-xs text-yellow-400">{req.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {requestType === "suggestion" && (
              <>
                <div className="w-full">
                  <textarea
                    placeholder="Your Suggestion"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) {
                        setErrors({ ...errors, description: "" });
                      }
                    }}
                    className={`p-4 glass-container text-white rounded-md w-full text-lg h-40 transition-all ${
                      errors.description 
                        ? "ring-2 ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                        : formData.description 
                          ? "ring-2 ring-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                          : ""
                    }`}
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <label className="flex items-center gap-3 text-lg">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                    className="w-5 h-5 accent-blue-500"
                  />
                  <span className={formData.isAnonymous ? "text-blue-300 font-semibold" : ""}>
                    Submit Anonymously {formData.isAnonymous && "- Your identity will be hidden"}
                  </span>
                </label>
              </>
            )}

            {requestType === "supply" && (
              <>
                <div className="w-full">
                  <select
                    value={formData.supplyType}
                    onChange={(e) => {
                      setFormData({ ...formData, supplyType: e.target.value });
                      if (errors.supplyType) {
                        setErrors({ ...errors, supplyType: "" });
                      }
                    }}
                    className={`p-4 glass-container text-white rounded-md w-full text-lg transition-all ${
                      errors.supplyType 
                        ? "ring-2 ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                        : formData.supplyType 
                          ? "ring-2 ring-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                          : ""
                    }`}
                  >
                    <option value="">Select Supply Type</option>
                    <option value="snacks">Snacks</option>
                    <option value="office">Office Supply</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.supplyType && <p className="text-red-500 text-sm mt-1">{errors.supplyType}</p>}
                </div>

                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Enter Supply Name"
                    value={formData.supplyName}
                    onChange={(e) => {
                      setFormData({ ...formData, supplyName: e.target.value });
                      if (errors.supplyName) {
                        setErrors({ ...errors, supplyName: "" });
                      }
                    }}
                    className={`p-4 glass-container text-white rounded-md w-full text-lg transition-all ${
                      errors.supplyName 
                        ? "ring-2 ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                        : formData.supplyName 
                          ? "ring-2 ring-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                          : ""
                    }`}
                  />
                  {errors.supplyName && <p className="text-red-500 text-sm mt-1">{errors.supplyName}</p>}
                </div>
                {supplyRequests.length > 0 && (
        <div className="w-full max-h-40 overflow-y-auto glass-container p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Existing Supply Requests:</h3>
          {supplyRequests.map((req) => (
            <div key={req.id}  className="glass-container p-3 rounded-lg mb-2 flex justify-between items-center"> 
              <span className="text-white font-bold">{req.itemName}</span>
              <span className="text-xs text-yellow-400">{req.status}</span>
            </div>
          ))}
        </div>
      )}
              </>
            )}
          </div>

          <div className="flex justify-between mt-8 w-full">
            <button
              onClick={() => setStep(0)}
              className="px-6 py-3 bg-gray-500 rounded-lg hover:bg-gray-600 text-lg transition shadow-[0_0_10px_rgba(107,114,128,0.3)] hover:shadow-[0_0_15px_rgba(107,114,128,0.5)]"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg text-lg transition ${
                isSubmitting 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-500 hover:bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}