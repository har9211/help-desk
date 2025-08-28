import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Send, CheckCircle } from "lucide-react";
import { Issue } from "@/entities/Issue";
import { User } from "@/entities/User";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categories = [
  { value: "water_supply", label: "Water Supply" },
  { value: "electricity", label: "Electricity" },
  { value: "roads", label: "Roads & Infrastructure" },
  { value: "sanitation", label: "Sanitation & Cleanliness" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "agriculture", label: "Agriculture" },
  { value: "other", label: "Other" }
];

const priorities = [
  { value: "low", label: "Low - Can wait" },
  { value: "medium", label: "Medium - Normal issue" },
  { value: "high", label: "High - Important" },
  { value: "urgent", label: "Urgent - Immediate attention needed" }
];

export default function SubmitIssue() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    contact_phone: "",
    location: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Issue.create(formData);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        navigate(createPageUrl("Dashboard"));
      }, 3000);
    } catch (error) {
      console.error("Error submitting issue:", error);
    }
    
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Issue Submitted Successfully!</h2>
              <p className="text-green-700 mb-4">
                Your issue has been submitted and assigned a tracking ID. 
                A government official will review it and contact you soon.
              </p>
              <p className="text-sm text-green-600">
                Redirecting you back to the dashboard...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Submit an Issue</h1>
          <p className="text-slate-600">Report problems that need government attention</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Issue Report Form
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Brief description of the issue"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide detailed information about the problem..."
                  className="mt-1 h-32"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Priority Level</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => setFormData({...formData, priority: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_phone">Contact Phone *</Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    required
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                    placeholder="Your phone number"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Where is this issue located?"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Your issue will be reviewed by government officials. 
                  Please provide accurate information for faster resolution.
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.title || !formData.description || !formData.category}
                className="w-full bg-red-500 hover:bg-red-600 py-6 text-lg"
              >
                {isSubmitting ? (
                  "Submitting Issue..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Issue
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}