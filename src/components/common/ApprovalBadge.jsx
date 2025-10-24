import React from 'react';

const ApprovalBadge = ({ 
  status, 
  timestamp, 
  approver, 
  className = '' 
}) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
        return {
          class: 'approved',
          text: 'Approved',
          icon: '✓'
        };
      case 'rejected':
        return {
          class: 'rejected',
          text: 'Rejected',
          icon: '✗'
        };
      case 'pending':
      default:
        return {
          class: 'pending',
          text: 'Pending',
          icon: '○'
        };
    }
  };

  const config = getStatusConfig(status);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`approval-badge ${config.class} ${className}`}>
      <span className="approval-icon">{config.icon}</span>
      <span className="approval-text">{config.text}</span>
      {approver && (
        <span className="approval-approver">by {approver}</span>
      )}
      {timestamp && (
        <div className="approval-timestamp">
          {formatTimestamp(timestamp)}
        </div>
      )}
    </div>
  );
};

export default ApprovalBadge;
