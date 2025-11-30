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

  const saveProfile = async (updatedProfile: DesignerProfile) => {
    if (!user) return;
    const storageKey = isDemo ? PROFILE_KEY : `dc:designerProfile:${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);

    // Upsert to Supabase designer_details table
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase
        .from('designer_details')
        .upsert({
          user_id: user.id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          profile_pic: updatedProfile.profilePic,
          specialization: updatedProfile.specialization,
          studio: updatedProfile.studio,
          phone: updatedProfile.phone,
          address: updatedProfile.address,
          experience: updatedProfile.experience,
          gst_id: updatedProfile.gstId,
          about: updatedProfile.about
        }, { onConflict: 'user_id' });
      if (error) {
        // Optionally show error to user
        console.error('Failed to save profile to Supabase:', error.message);
      }
    } catch (err) {
      console.error('Supabase upsert error:', err);
    }
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
      // Real user - try to fetch profile from Supabase first
      const fetchProfile = async () => {
        const userProfileKey = `dc:designerProfile:${user.id}`;
        try {
          const { supabase } = await import('@/lib/supabase');
          const { data, error } = await supabase
            .from('designer_details')
            .select('*')
            .eq('user_id', user.id)
            .single();
          if (error) {
            console.warn('Supabase fetch error:', error.message);
          }
          if (data) {
            // Map Supabase data to DesignerProfile
            const loadedProfile: DesignerProfile = {
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              studio: data.studio || '',
              experience: data.experience || '',
              specialization: data.specialization || '',
              address: data.address || '',
              gstId: data.gst_id || '',
              certificationId: data.certification_id || '',
              reraId: data.rera_id || '',
              about: data.about || '',
              portfolioUrl: data.portfolio_url || '',
              profilePic: data.profile_pic || '',
            };
            setProfile(loadedProfile);
            localStorage.setItem(userProfileKey, JSON.stringify(loadedProfile));
            return;
          }
        } catch (err) {
          console.error('Error fetching profile from Supabase:', err);
        }
        // Fallback to localStorage if Supabase fetch fails or no data
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
      };
      fetchProfile();
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
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState<DesignerProfile>(profile);

  // Separate edit state for top profile area
  const isProfileEditing = editingSection === 'profile';

  const handleSave = () => {
    onSave(editedProfile);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setEditingSection(null);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#f2f0ed] mb-2">
            <img
              src={isProfileEditing ? (editedProfile.profilePic || "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&auto=format&fit=crop") : (profile.profilePic || "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&auto=format&fit=crop")}
              alt="Profile picture"
              className="object-cover w-full h-full"
            />
            {isProfileEditing && (
              <>
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const { supabase } = await import('@/lib/supabase');
                    const fileExt = file.name.split('.').pop();
                    const fileName = `profile_${Date.now()}.${fileExt}`;
                    const { data, error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
                    if (!error && data) {
                      const { publicURL } = supabase.storage.from('avatars').getPublicUrl(data.path).data;
                      setEditedProfile(prev => ({ ...prev, profilePic: publicURL }));
                    } else {
                      alert('Failed to upload image');
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('profile-pic-upload')?.click()}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100 transition"
                  aria-label="Change profile picture"
                >
                  <FiCamera size={20} className="text-[#d96857]" />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex-1">
          {isProfileEditing ? (
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
          <p className="text-sm text-zinc-600">{isProfileEditing ? editedProfile.specialization : profile.specialization}</p>
          <p className="text-sm text-zinc-600">{isProfileEditing ? editedProfile.studio : profile.studio}</p>
        </div>
        <div className="flex gap-2">
          {isProfileEditing ? (
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
              onClick={() => setEditingSection('profile')}
              className="px-3 py-1 text-[#d96857] border border-[#d96857] rounded text-sm hover:bg-[#d96857]/10"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Contact */}
      <Section title="Contact Information" showEdit onEdit={() => setEditingSection('contact')}>
        <Grid>
          <Info label="Email" value={editingSection === 'contact' ? (
            <input type="email" value={editedProfile.email} onChange={e => setEditedProfile(prev => ({ ...prev, email: e.target.value }))} className="w-full border border-zinc-300 rounded px-2 py-1 text-sm" />
          ) : profile.email} />
          <Info label="Phone" value={editingSection === 'contact' ? (
            <input type="text" value={editedProfile.phone} onChange={e => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))} className="w-full border border-zinc-300 rounded px-2 py-1 text-sm" />
          ) : profile.phone} />
          <Info label="Address" value={editingSection === 'contact' ? (
            <input type="text" value={editedProfile.address} onChange={e => setEditedProfile(prev => ({ ...prev, address: e.target.value }))} className="w-full border border-zinc-300 rounded px-2 py-1 text-sm" />
          ) : profile.address} />
          <Info label="Experience" value={editingSection === 'contact' ? (
            <input type="text" value={editedProfile.experience} onChange={e => setEditedProfile(prev => ({ ...prev, experience: e.target.value }))} className="w-full border border-zinc-300 rounded px-2 py-1 text-sm" />
          ) : profile.experience} />
        </Grid>
        {editingSection === 'contact' && (
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="px-3 py-1 bg-[#d96857] text-white rounded text-sm hover:bg-[#d96857]/90">Save</button>
            <button onClick={handleCancel} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Cancel</button>
          </div>
        )}
      </Section>

      {/* Professional */}
      <Section title="Professional Details" solid showEdit onEdit={() => setEditingSection('professional')}>
        <Grid>
          <Info label="Studio / Company" value={editingSection === 'professional' ? (
            <input type="text" value={editedProfile.studio} onChange={e => setEditedProfile(prev => ({ ...prev, studio: e.target.value }))} className="w-full border border-zinc-300 rounded px-2 py-1 text-sm" />
          ) : profile.studio} />
          <Info label="Specialization" value={editingSection === 'professional' ? (
            <input type="text" value={editedProfile.specialization} onChange={e => setEditedProfile(prev => ({ ...prev, specialization: e.target.value }))} className="w-full border border-zinc-300 rounded px-2 py-1 text-sm" />
          ) : profile.specialization} />
          <Info label="GST ID" value={editingSection === 'professional' ? (
            <input type="text" value={editedProfile.gstId || ''} onChange={e => setEditedProfile(prev => ({ ...prev, gstId: e.target.value }))} className="w-full border border-zinc-300 rounded px-2 py-1 text-sm" />
          ) : (profile.gstId || "-")} />
          <Info label="Certification ID" value={editingSection === 'professional' ? (
            <input type="text" value={editedProfile.certificationId || ''} onChange={e => setEditedProfile(prev => ({ ...prev, certificationId: e.target.value }))} className="w-full border border-zinc-300 rounded px-2 py-1 text-sm" />
          ) : (profile.certificationId || "-")} />
          <Info label="RERA ID" value={editingSection === 'professional' ? (
            <input type="text" value={editedProfile.reraId || ''} onChange={e => setEditedProfile(prev => ({ ...prev, reraId: e.target.value }))} className="w-full border border-zinc-300 rounded px-2 py-1 text-sm" />
          ) : (profile.reraId || "-")} />
          <Info label="Portfolio" value={editingSection === 'professional' ? (
            <input type="text" value={editedProfile.portfolioUrl || ''} onChange={e => setEditedProfile(prev => ({ ...prev, portfolioUrl: e.target.value }))} className="w-full border border-zinc-300 rounded px-2 py-1 text-sm" />
          ) : profile.portfolioUrl} link />
        </Grid>
        {editingSection === 'professional' && (
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="px-3 py-1 bg-[#d96857] text-white rounded text-sm hover:bg-[#d96857]/90">Save</button>
            <button onClick={handleCancel} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Cancel</button>
          </div>
        )}
      </Section>

      {/* About */}
      <Section title="About Designer" solid showEdit onEdit={() => setEditingSection('about')}>
        {editingSection === 'about' ? (
          <textarea value={editedProfile.about} onChange={e => setEditedProfile(prev => ({ ...prev, about: e.target.value }))} className="w-full border border-zinc-300 rounded px-2 py-1 text-sm min-h-[60px]" />
        ) : (
          <p className="text-sm text-[#2e2e2e] leading-relaxed whitespace-pre-line">
            {profile.about}
          </p>
        )}
        {editingSection === 'about' && (
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="px-3 py-1 bg-[#d96857] text-white rounded text-sm hover:bg-[#d96857]/90">Save</button>
            <button onClick={handleCancel} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Cancel</button>
          </div>
        )}
      </Section>

      {/* Certificates (static placeholders for demo) */}
      <Section title="Certificates / IDs" showEdit onEdit={() => setEditingSection('certificates')}>
        <ul className="list-disc list-inside text-sm text-[#2e2e2e] space-y-1">
          <li>Interior Design Certification — IDA (2019)</li>
          <li>3D Visualization Pro Certificate — Autodesk (2021)</li>
          <li>Registered with Indian Institute of Interior Designers</li>
        </ul>
        {editingSection === 'certificates' && (
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="px-3 py-1 bg-[#d96857] text-white rounded text-sm hover:bg-[#d96857]/90">Save</button>
            <button onClick={handleCancel} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Cancel</button>
          </div>
        )}
      </Section>
    </div>
  );
}

import { FiEdit2, FiCamera } from 'react-icons/fi';

function Section({
  title,
  children,
  solid = false,
  onEdit,
  showEdit = false
}: {
  title: string;
  children: React.ReactNode;
  solid?: boolean;
  onEdit?: () => void;
  showEdit?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border border-zinc-200 p-5 ${
        solid ? "bg-white shadow-sm" : "bg-[#f2f0ed]"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#2e2e2e]">{title}</h3>
        {showEdit && (
          <button
            onClick={onEdit}
            className="ml-2 p-1 rounded hover:bg-zinc-100 text-[#d96857]"
            aria-label={`Edit ${title}`}
          >
            <FiEdit2 size={18} />
          </button>
        )}
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
