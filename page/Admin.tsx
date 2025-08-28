import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Phone,
  MapPin,
  Calendar
} from "lucide-react";
import { Issue } from "@/entities/Issue";
import { User } from "@/entities/User";
import { format } from "date-fns";

const statusColors = {
  submitted: "bg-blue-100 text-blue-800",
  in_review: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-purple-100 text-purple-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800"
};

const priorityColors = {
  low: "bg-slate-100 text-slate-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

export default function Admin() {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [response, setResponse] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        if (!userData.is_admin) {
          // Redirect non-admin users
          window.location.href = "/";
          return;
        }
        setUser(userData);
        
        const issueData = await Issue.list("-created_date");
        setIssues(issueData);
      } catch (error) {
        console.error("Error loading admin data:", error);
      }
    };
    loadData();
  }, []);

  const updateIssueStatus = async (issueId, newStatus) => {
    setIsUpdating(true);
    try {
      const updateData = { status: newStatus };
      if (newStatus === 'resolved') {
        updateData.resolved_date = new Date().toISOString().split('T')[0];
      }
      if (response.trim()) {
        updateData.admin_response = response.trim();
      }
      
      await Issue.update(issueId, updateData);
      
      // Refresh issues list
      const updatedIssues = await Issue.list("-created_date");
      setIssues(updatedIssues);
      
      setSelectedIssue(null);
      setResponse("");
    } catch (error) {
      console.error("Error updating issue:", error);
    }
    setIsUpdating(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'in_review': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!user || !user.is_admin) {
    return (
      <div className="p-4 lg:p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-slate-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Admin Panel</h1>
          <p className="text-slate-600">Manage community issues and requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              title: "Total Issues", 
              count: issues.length, 
              color: "bg-blue-500",
              icon: Shield 
            },
            { 
              title: "Pending", 
              count: issues.filter(i => i.status === 'submitted').length, 
              color: "bg-yellow-500",
              icon: Clock 
            },
            { 
              title: "In Progress", 
              count: issues.filter(i => i.status === 'in_progress').length, 
              color: "bg-purple-500",
              icon: AlertTriangle 
            },
            { 
              title: "Resolved", 
              count: issues.filter(i => i.status === 'resolved').length, 
              color: "bg-green-500",
              icon: CheckCircle 
            }
          ].map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
                  </div>
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Issues List */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Recent Issues</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedIssue?.id === issue.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-slate-900 flex-1">{issue.title}</h3>
                      <Badge className={`ml-2 ${priorityColors[issue.priority]}`}>
                        {issue.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(issue.created_date), 'MMM d')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {issue.contact_phone}
                      </span>
                      {issue.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {issue.location}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 capitalize">
                        {issue.category?.replace(/_/g, ' ')}
                      </span>
                      <Badge className={`${statusColors[issue.status]} flex items-center gap-1`}>
                        {getStatusIcon(issue.status)}
                        {issue.status?.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Issue Details */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedIssue ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">
                      {selectedIssue.title}
                    </h3>
                    <p className="text-slate-700 mb-4">{selectedIssue.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Category:</span>
                      <p className="font-medium capitalize">
                        {selectedIssue.category?.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Priority:</span>
                      <p className="font-medium capitalize">{selectedIssue.priority}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Contact:</span>
                      <p className="font-medium">{selectedIssue.contact_phone}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Location:</span>
                      <p className="font-medium">{selectedIssue.location || 'Not specified'}</p>
                    </div>
                  </div>

                  {selectedIssue.admin_response && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <span className="text-sm text-green-700 font-medium">Admin Response:</span>
                      <p className="text-green-800 mt-1">{selectedIssue.admin_response}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Response/Update (optional)
                    </label>
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Add a response or update for the citizen..."
                      className="h-24"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedIssue.status === 'submitted' && (
                      <Button
                        onClick={() => updateIssueStatus(selectedIssue.id, 'in_review')}
                        disabled={isUpdating}
                        variant="outline"
                      >
                        Mark as In Review
                      </Button>
                    )}
                    
                    {(selectedIssue.status === 'in_review' || selectedIssue.status === 'submitted') && (
                      <Button
                        onClick={() => updateIssueStatus(selectedIssue.id, 'in_progress')}
                        disabled={isUpdating}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        Start Working
                      </Button>
                    )}
                    
                    {selectedIssue.status !== 'resolved' && (
                      <Button
                        onClick={() => updateIssueStatus(selectedIssue.id, 'resolved')}
                        disabled={isUpdating}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Mark as Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Select an issue to view details and take action</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}