'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { useRouter } from 'next/navigation';

type DesignerProfile = {
  name: string;
  email: string;
  phone: string;
  studio: string;
  experience: string;
  specialization: string;
  address: string;
  gstId?: string;
  certificationId?: string;
  reraId?: string;
  about: string;
  portfolioUrl?: string;
  profilePic?: string;
};

const PROFILE_KEY = "dc:designerProfile";
const USER_EMAIL_KEY = "dc:userEmail";

export default function AccountPage() {
  const { user, isDemo } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<DesignerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const saveProfile = (updatedProfile: DesignerProfile) => {
    if (!user) return;
    
    const storageKey = isDemo ? PROFILE_KEY : `dc:designerProfile:${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
  };

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.replace('/login');
      return;
    }

    if (isDemo) {
      // Load or create demo profile
      const existing = localStorage.getItem(PROFILE_KEY);
      if (existing) {
        setProfile(JSON.parse(existing) as DesignerProfile);
      } else {
        const demo: DesignerProfile = {
          name: "Demo Designer",
          email: "demo@designandcart.in",
          phone: "+91 98765 43210",
          studio: "De'Artisa Designs LLP",
          experience: "6 years",
          specialization: "Residential & Commercial Interiors",
          address: "HSR Layout, Bengaluru, Karnataka",
          gstId: "29ABCDE1234F2Z5",
          certificationId: "INT-000923",
          reraId: "RERA-KA-12345",
          about:
            "A passionate interior designer focused on modern, sustainable design. Helping clients visualize and implement spaces with real, purchasable products.",
          portfolioUrl: "https://designandcart.in/portfolio/demo",
          profilePic:
            "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&auto=format&fit=crop",
        };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(demo));
        setProfile(demo);
      }
    } else {
      // Real user - load or create their profile
      const userProfileKey = `dc:designerProfile:${user.id}`;
      const existing = localStorage.getItem(userProfileKey);
      
      if (existing) {
        setProfile(JSON.parse(existing) as DesignerProfile);
      } else {
        // Create a basic profile from user data
        const newProfile: DesignerProfile = {
          name: (user as any).user_metadata?.full_name || (user as any).name || 'Designer',
          email: user.email || '',
          phone: '',
          studio: '',
          experience: '',
          specialization: 'Interior Design',
          address: '',
          about: 'Welcome to Design & Cart! Complete your profile to showcase your expertise.',
        };
        localStorage.setItem(userProfileKey, JSON.stringify(newProfile));
        setProfile(newProfile);
      }
    }

    setLoading(false);
  }, [user, router, isDemo]);

  if (loading) {
    return <main className="p-10 text-zinc-500">Loading…</main>;
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-1.5 rounded-full bg-[#d96857]" />
          <h1 className="text-2xl font-semibold text-[#2e2e2e]">Account</h1>
        </div>

        <ProfileCard profile={profile} onSave={saveProfile} isDemo={isDemo} />
      </div>
    </main>
  );
}

// ---------------- Components ----------------



function ProfileCard({ 
  profile, 
  onSave, 
  isDemo 
}: { 
  profile: DesignerProfile; 
  onSave: (updatedProfile: DesignerProfile) => void;
  isDemo: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<DesignerProfile>(profile);

  const handleSave = () => {
    onSave(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#f2f0ed]">
          <img
            src={
              (isEditing ? editedProfile.profilePic : profile.profilePic) ||
              "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&auto=format&fit=crop"
            }
            alt={isEditing ? editedProfile.name : profile.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedProfile.name}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
              className="text-xl font-semibold text-[#2e2e2e] border border-zinc-300 rounded px-2 py-1 w-full"
            />
          ) : (
            <h2 className="text-xl font-semibold text-[#2e2e2e]">
              {profile.name}
            </h2>
          )}
          <p className="text-sm text-zinc-600">{isEditing ? editedProfile.specialization : profile.specialization}</p>
          <p className="text-sm text-zinc-600">{isEditing ? editedProfile.studio : profile.studio}</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-[#d96857] text-white rounded text-sm hover:bg-[#d96857]/90"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-[#d96857] border border-[#d96857] rounded text-sm hover:bg-[#d96857]/10"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Contact */}
      <Section title="Contact Information">
        <Grid>
          <Info label="Email" value={isEditing ? editedProfile.email : profile.email} />
          <Info label="Phone" value={isEditing ? editedProfile.phone : profile.phone} />
          <Info label="Address" value={isEditing ? editedProfile.address : profile.address} />
          <Info label="Experience" value={isEditing ? editedProfile.experience : profile.experience} />
        </Grid>
      </Section>

      {/* Professional */}
      <Section title="Professional Details" solid>
        <Grid>
          <Info label="Studio / Company" value={isEditing ? editedProfile.studio : profile.studio} />
          <Info label="Specialization" value={isEditing ? editedProfile.specialization : profile.specialization} />
          <Info label="GST ID" value={(isEditing ? editedProfile.gstId : profile.gstId) || "-"} />
          <Info label="Certification ID" value={(isEditing ? editedProfile.certificationId : profile.certificationId) || "-"} />
          <Info label="RERA ID" value={(isEditing ? editedProfile.reraId : profile.reraId) || "-"} />
          <Info label="Portfolio" value={isEditing ? editedProfile.portfolioUrl : profile.portfolioUrl} link />
        </Grid>
      </Section>

      {/* About */}
      <Section title="About Designer" solid>
        <p className="text-sm text-[#2e2e2e] leading-relaxed whitespace-pre-line">
          {isEditing ? editedProfile.about : profile.about}
        </p>
      </Section>

      {/* Certificates (static placeholders for demo) */}
      <Section title="Certificates / IDs">
        <ul className="list-disc list-inside text-sm text-[#2e2e2e] space-y-1">
          <li>Interior Design Certification — IDA (2019)</li>
          <li>3D Visualization Pro Certificate — Autodesk (2021)</li>
          <li>Registered with Indian Institute of Interior Designers</li>
        </ul>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
  solid = false,
}: {
  title: string;
  children: React.ReactNode;
  solid?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border border-zinc-200 p-5 ${
        solid ? "bg-white shadow-sm" : "bg-[#f2f0ed]"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#2e2e2e]">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-3">{children}</div>;
}

function Info({
  label,
  value,
  link = false,
}: {
  label: string;
  value?: string;
  link?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-zinc-500 mb-0.5">{label}</div>
      {value ? (
        link ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-[#d96857] hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <div className="text-sm text-[#2e2e2e]">{value}</div>
        )
      ) : (
        <div className="text-sm text-zinc-400">—</div>
      )}
    </div>
  );
}
