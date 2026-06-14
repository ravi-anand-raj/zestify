"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/shared/PageHeader"
import { useLanguage } from "@/components/providers/LanguageProvider"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  TrendingUp,
  Shield,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  Wallet,
  Target,
  ArrowUpRight,
  Edit3,
  CreditCard,
} from "lucide-react"

// Mock profile data (would come from Prisma in production)
const profileData = {
  firstName: "John",
  lastName: "Smith",
  email: "john@example.com",
  phone: "+91 98765 43210",
  dateOfBirth: "1992-06-15",
  gender: "Male",
  panNumber: "ABCPD1234E",
  aadhaarLastFour: "5678",
  addressLine1: "42, Koramangala",
  city: "Bangalore",
  state: "Karnataka",
  pincode: "560034",
  country: "India",
  occupation: "Software Engineer",
  employerName: "TechCorp India",
  annualIncome: "₹18,00,000",
  investmentExperience: "Intermediate",
  riskTolerance: "Moderate",
  memberSince: "January 2025",
  zestScore: 782,
}

const stats = [
  { label: "Portfolios", value: "3", icon: Wallet, color: "text-primary" },
  { label: "Active Goals", value: "4", icon: Target, color: "text-accent" },
  { label: "Transactions", value: "127", icon: CreditCard, color: "text-warning" },
  { label: "Zest-Score", value: "782", icon: Zap, color: "text-primary", highlight: true },
]

const kycItems = [
  { label: "Email Verified", status: "verified", icon: Mail },
  { label: "PAN Verified", status: "verified", icon: Shield },
  { label: "Aadhaar Verification", status: "pending", icon: Shield },
  { label: "Bank Account", status: "verified", icon: CreditCard },
]

export default function ProfilePage() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const [editOpen, setEditOpen] = useState(false)
  const [firstName, setFirstName] = useState(profileData.firstName)
  const [lastName, setLastName] = useState(profileData.lastName)
  const [phone, setPhone] = useState(profileData.phone)

  // Sync session data to local state when loaded
  useEffect(() => {
    if (session?.user?.name) {
      const parts = session.user.name.split(" ")
      if (parts[0]) setFirstName(parts[0])
      if (parts.slice(1).join(" ")) setLastName(parts.slice(1).join(" "))
    }
  }, [session?.user?.name])

  const handleSave = () => {
    toast.success("Profile updated successfully")
    setEditOpen(false)
  }

  return (
    <div className="space-y-6 max-w-[1000px]">
      <PageHeader icon={User} title={t.profile.title} description={t.profile.description} />

      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 dark:from-emerald-600 dark:via-green-600 dark:to-teal-600 relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 sm:-mt-14">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-card shadow-elevated">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-2xl sm:text-3xl font-bold">
                {firstName[0] || ""}{lastName[0] || ""}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 pt-2 sm:pt-0 sm:pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h2 className="text-2xl font-bold tracking-tight">
                  {firstName} {lastName}
                </h2>
                <Badge className="w-fit bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                  <Zap className="h-3 w-3 mr-1" />
                  Zest-Score: {profileData.zestScore}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {session?.user?.email || profileData.email}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {t.profile.memberSince} {profileData.memberSince}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              onClick={() => setEditOpen(true)}
            >
              <Edit3 className="h-3.5 w-3.5" />
              {t.settings.editProfile}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <Card
            key={stat.label}
            className={`group hover:shadow-card-hover transition-all duration-300 animate-slide-up ${stat.highlight ? 'border-primary/20' : ''}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 dark:bg-white/[0.06] ${stat.highlight ? 'bg-primary/10 dark:bg-primary/10' : ''}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Personal Details */}
        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" />
              {t.profile.personalDetails}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: t.auth.firstName, value: firstName, icon: User },
              { label: t.auth.lastName, value: lastName, icon: User },
              { label: t.auth.email, value: session?.user?.email || profileData.email, icon: Mail },
              { label: t.settings.phone, value: phone, icon: Phone },
              { label: t.profile.dateOfBirth, value: "June 15, 1992", icon: Calendar },
              { label: t.profile.gender, value: profileData.gender, icon: User },
              { label: t.profile.panNumber, value: "XXXX" + profileData.panNumber.slice(-4), icon: Shield },
              { label: t.profile.address, value: `${profileData.addressLine1}, ${profileData.city}`, icon: MapPin },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 dark:bg-white/[0.04] shrink-0">
                  <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Financial Details + KYC */}
        <div className="space-y-4">
          {/* Financial Details */}
          <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-accent" />
                {t.profile.financialDetails}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: t.profile.annualIncome, value: profileData.annualIncome, icon: Wallet },
                { label: t.profile.occupation, value: profileData.occupation, icon: Briefcase },
                { label: t.profile.employer, value: profileData.employerName, icon: Briefcase },
                { label: t.profile.investmentExperience, value: profileData.investmentExperience, icon: TrendingUp },
                { label: t.profile.riskTolerance, value: profileData.riskTolerance, icon: Shield },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 dark:bg-white/[0.04] shrink-0">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* KYC Status */}
          <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-primary" />
                {t.profile.kycStatus}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {kycItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 dark:bg-white/[0.02] border border-border">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.status === "verified" ? (
                    <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px] gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {t.profile.verified}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-warning border-warning/20 text-[10px] gap-1">
                      <Clock className="h-3 w-3" />
                      {t.profile.pending}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.settings.editProfile}</DialogTitle>
            <DialogDescription>{t.settings.profileDescription}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.auth.firstName}</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.auth.lastName}</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.settings.phone}</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white">{t.settings.saveChanges}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
