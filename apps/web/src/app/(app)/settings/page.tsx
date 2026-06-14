"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, User, Bell, Shield, Link2, Trash2, Sun, Moon, Monitor, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/shared/PageHeader"
import { useTheme } from "@/components/providers/ThemeProvider"
import { useLanguage } from "@/components/providers/LanguageProvider"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { LanguageCode } from "@/lib/translations"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { t, language, setLanguage, languages } = useLanguage()
  const { data: session } = useSession()

  const [profileOpen, setProfileOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Profile form
  const [firstName, setFirstName] = useState("John")
  const [lastName, setLastName] = useState("Smith")
  const [email, setEmail] = useState("john@example.com")
  const [phone, setPhone] = useState("+91 98765 43210")

  // Sync session data to local state when loaded
  useEffect(() => {
    if (session?.user?.name) {
      const parts = session.user.name.split(" ")
      if (parts[0]) setFirstName(parts[0])
      if (parts.slice(1).join(" ")) setLastName(parts.slice(1).join(" "))
    }
    if (session?.user?.email) {
      setEmail(session.user.email)
    }
  }, [session?.user?.name, session?.user?.email])

  // Password form
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [pushAlerts, setPushAlerts] = useState(true)
  const [aiInsights, setAiInsights] = useState(true)
  const [priceAlerts, setPriceAlerts] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  const handleProfileSave = () => {
    toast.success("Profile updated successfully")
    setProfileOpen(false)
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    toast.success("Password changed successfully")
    setPasswordOpen(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleDeleteAccount = () => {
    toast.error("Account deletion is disabled in demo mode")
    setDeleteOpen(false)
  }

  const themeOptions = [
    { value: "light" as const, label: t.settings.themeLight, icon: Sun, description: "Clean, bright interface" },
    { value: "dark" as const, label: t.settings.themeDark, icon: Moon, description: "Easy on the eyes" },
    { value: "system" as const, label: t.settings.themeSystem, icon: Monitor, description: "Follow device settings" },
  ]

  return (
    <div className="space-y-6 max-w-[900px]">
      <PageHeader icon={Settings} title={t.settings.title} description={t.settings.description} />

      <div className="space-y-4">
        {/* ═══ Appearance ═══ */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sun className="h-4 w-4 text-primary" />
              {t.settings.appearance}
            </CardTitle>
            <CardDescription>{t.settings.appearanceDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">{t.settings.theme}</Label>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => {
                  const isActive = theme === option.value
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer",
                        isActive
                          ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-glow-primary"
                          : "border-border hover:border-muted-foreground/30 hover:bg-muted/30 dark:hover:bg-white/[0.03]"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-muted/50 dark:bg-white/[0.06] text-muted-foreground"
                      )}>
                        <option.icon className="h-5 w-5" />
                      </div>
                      <div className="text-center">
                        <p className={cn(
                          "text-sm font-semibold",
                          isActive ? "text-primary" : "text-foreground"
                        )}>
                          {option.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ═══ Language ═══ */}
        <Card className="animate-slide-up" style={{ animationDelay: '60ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-primary" />
              {t.settings.language}
            </CardTitle>
            <CardDescription>{t.settings.languageDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {languages.map((lang) => {
                const isActive = language === lang.code
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as LanguageCode)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer text-left",
                      isActive
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-border hover:border-muted-foreground/30 hover:bg-muted/30 dark:hover:bg-white/[0.03]"
                    )}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div>
                      <p className={cn(
                        "text-sm font-medium",
                        isActive ? "text-primary" : "text-foreground"
                      )}>
                        {lang.nativeName}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{lang.name}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ═══ Profile ═══ */}
        <Card className="animate-slide-up" style={{ animationDelay: '120ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" /> {t.settings.profile}
            </CardTitle>
            <CardDescription>{t.settings.profileDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t.settings.name}</p>
                <p className="font-medium">{firstName} {lastName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t.auth.email}</p>
                <p className="font-medium">{email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t.settings.phone}</p>
                <p className="font-medium">{phone}</p>
              </div>
              <div className="flex items-end">
                <Button variant="outline" size="sm" onClick={() => setProfileOpen(true)} className="rounded-xl">
                  {t.settings.editProfile}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ═══ Notifications ═══ */}
        <Card className="animate-slide-up" style={{ animationDelay: '180ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" /> {t.settings.notifications}
            </CardTitle>
            <CardDescription>{t.settings.notificationsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: t.settings.emailAlerts, desc: t.settings.emailAlertsDesc, checked: emailAlerts, onChange: setEmailAlerts },
              { label: t.settings.pushNotifications, desc: t.settings.pushNotificationsDesc, checked: pushAlerts, onChange: setPushAlerts },
              { label: t.settings.aiInsights, desc: t.settings.aiInsightsDesc, checked: aiInsights, onChange: setAiInsights },
              { label: t.settings.priceAlerts, desc: t.settings.priceAlertsDesc, checked: priceAlerts, onChange: setPriceAlerts },
              { label: t.settings.weeklyDigest, desc: t.settings.weeklyDigestDesc, checked: weeklyDigest, onChange: setWeeklyDigest },
            ].map((item, i, arr) => (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={item.checked} onCheckedChange={item.onChange} />
                </div>
                {i < arr.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ═══ Connected Accounts ═══ */}
        <Card className="animate-slide-up" style={{ animationDelay: '240ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Link2 className="h-4 w-4 text-primary" /> {t.settings.connectedAccounts}
            </CardTitle>
            <CardDescription>{t.settings.connectedAccountsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 dark:bg-white/[0.02] border border-border">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-500 dark:text-blue-400">
                  CH
                </div>
                <div>
                  <p className="text-sm font-medium">Chase Bank</p>
                  <p className="text-xs text-muted-foreground">2 accounts connected</p>
                </div>
              </div>
              <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px]">Active</Badge>
            </div>
            <Button variant="outline" size="sm" className="text-xs rounded-xl">
              <Link2 className="h-3 w-3 mr-1.5" />
              {t.settings.connectNew}
            </Button>
          </CardContent>
        </Card>

        {/* ═══ Security ═══ */}
        <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-primary" /> {t.settings.security}
            </CardTitle>
            <CardDescription>{t.settings.securityDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" onClick={() => setPasswordOpen(true)} className="rounded-xl">
              {t.settings.changePassword}
            </Button>
          </CardContent>
        </Card>

        {/* ═══ Danger Zone ═══ */}
        <Card className="border-destructive/20 animate-slide-up" style={{ animationDelay: '360ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <Trash2 className="h-4 w-4" /> {t.settings.dangerZone}
            </CardTitle>
            <CardDescription>{t.settings.dangerZoneDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10 rounded-xl" onClick={() => setDeleteOpen(true)}>
              {t.settings.deleteAccount}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Profile Edit Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.settings.editProfile}</DialogTitle>
            <DialogDescription>{t.settings.profileDescription}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.auth.firstName}</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>{t.auth.lastName}</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.auth.email}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>{t.settings.phone}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handleProfileSave} className="bg-primary hover:bg-primary/90 text-white">{t.settings.saveChanges}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.settings.changePassword}</DialogTitle>
            <DialogDescription>{t.settings.securityDescription}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t.settings.currentPassword}</Label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>{t.settings.newPassword}</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>{t.settings.confirmPassword}</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handlePasswordChange} className="bg-primary hover:bg-primary/90 text-white">{t.settings.updatePassword}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.settings.deleteAccount}</DialogTitle>
            <DialogDescription>{t.settings.deleteAccountWarning}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>{t.common.cancel}</Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>{t.settings.deleteAccount}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
