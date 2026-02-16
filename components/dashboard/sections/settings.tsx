"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Palette,
  Globe,
  RefreshCw,
  Check,
} from "lucide-react";
import { useSettings, type Currency } from "@/lib/settings-context";

export function SettingsSection() {
  const { settings, setCurrency, setDarkMode, updateProfile } = useSettings();
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local form state derived from settings
  const [firstName, setFirstName] = useState(settings.profile.firstName);
  const [lastName, setLastName] = useState(settings.profile.lastName);
  const [email, setEmail] = useState(settings.profile.email);

  const handleSave = () => {
    setIsSaving(true);
    updateProfile({ firstName, lastName, email });
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return; // Max 2MB
    const reader = new FileReader();
    reader.onloadend = () => {
      updateProfile({ avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile and display preferences
        </p>
      </div>

      {/* Personal Information */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-medium">Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20 bg-secondary">
              {settings.profile.avatarUrl ? (
                <AvatarImage src={settings.profile.avatarUrl} alt="Profile" />
              ) : null}
              <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-semibold">
                {settings.profile.initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Avatar
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-secondary border-border focus:border-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-secondary border-border focus:border-accent"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-border focus:border-accent"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-medium">Display Preferences</CardTitle>
          <CardDescription>Customize how data is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
              </div>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => setDarkMode(checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Currency Format</p>
                <p className="text-sm text-muted-foreground">Display currency in your preferred format</p>
              </div>
            </div>
            <Select
              value={settings.currency}
              onValueChange={(val) => setCurrency(val as Currency)}
            >
              <SelectTrigger className="w-[140px] bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR (&euro;)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="AED">AED (AED)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
