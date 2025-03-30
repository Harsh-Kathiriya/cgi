import React from 'react';

export default function RequestCard({ request, handleStatusChange }) {
  return (
    <div className="p-6 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-2">{request.title}</h3>
      {request.type === "maintenance" && (
        <>
          <p className="text-sm mb-2">{request.description}</p>
          <p className="text-xs text-gray-400 mb-2">Status: {request.status}</p>
          <select
            className="mt-2 p-2 bg-gray-800 rounded-lg"
            value={request.status}
            onChange={(e) => handleStatusChange(request.id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </>
      )}
      <p className="text-xs text-gray-400 mt-4">Timestamp: {new Date(request.timestamp).toLocaleString()}</p>
      <p className="text-xs text-gray-400">User: {request.userName}</p>
    </div>
  );
}