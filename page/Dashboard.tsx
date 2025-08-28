import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MessageCircle, 
  FileText, 
  Shield, 
  ShoppingBag, 
  Newspaper, 
  GraduationCap, 
  Briefcase,
  Building2,
  ArrowRight,
  Users,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/User";
import { Issue } from "@/entities/Issue";

const services = [
  {
    title: "Chatbot Assistant",
    description: "Get instant help and answers to your questions",
    icon: MessageCircle,
    url: createPageUrl("Chatbot"),
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    title: "Submit Issue",
    description: "Report problems that need government attention",
    icon: FileText,
    url: createPageUrl("SubmitIssue"),
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    title: "Online Shop",
    description: "Browse and buy from local vendors",
    icon: ShoppingBag,
    url: createPageUrl("Shop"),
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    title: "News & Updates",
    description: "Stay informed with latest news and announcements",
    icon: Newspaper,
    url: createPageUrl("News"),
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    title: "Education Portal",
    description: "Access learning materials and educational resources",
    icon: GraduationCap,
    url: createPageUrl("Education"),
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  },
  {
    title: "Job Portal",
    description: "Find employment opportunities in your area",
    icon: Briefcase,
    url: createPageUrl("Jobs"),
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  {
    title: "Government Services",
    description: "Access police, hospital, legal and other services",
    icon: Building2,
    url: createPageUrl("GovServices"),
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200"
  }
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalIssues: 0, resolvedIssues: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        
        if (userData.is_admin) {
          const issues = await Issue.list();
          const resolved = issues.filter(issue => issue.status === 'resolved').length;
          setStats({ totalIssues: issues.length, resolvedIssues: resolved });
        }
      } catch (error) {
        // User not logged in or error loading data
      }
    };
    loadData();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full mx-4">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Welcome to Village Help Desk</CardTitle>
              <p className="text-slate-600">Digital services for our community</p>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-6 text-lg"
                onClick={() => User.login()}
              >
                Login to Continue
              </Button>
              <p className="text-xs text-slate-500 text-center mt-4">
                Access all village services with secure login
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 lg:p-8 text-white">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                  Welcome back, {user.full_name}!
                </h1>
                <p className="text-emerald-100 text-lg">
                  {user.village ? `${user.village} • ` : ''}Choose a service to get started
                </p>
              </div>
              {user.is_admin && (
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.totalIssues}</div>
                    <div className="text-emerald-100 text-sm">Total Issues</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.resolvedIssues}</div>
                    <div className="text-emerald-100 text-sm">Resolved</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => (
            <Link key={service.title} to={service.url}>
              <Card className={`h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 ${service.borderColor} ${service.bgColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Admin Quick Access */}
        {user.is_admin && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Admin Panel</h3>
                    <p className="text-slate-600">Manage community issues and requests</p>
                  </div>
                </div>
                <Link to={createPageUrl("Admin")}>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Access Admin Panel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}