import { User } from '../App';
import { UserDashboard } from './Profile/UserDashboard';

interface ProfileSectionProps {
  user: User | null;
  onLogout: () => void;
}

export function ProfileSection({ user, onLogout }: ProfileSectionProps) {
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
        <p className="text-gray-400">Sign in to view your profile and order history.</p>
      </div>
    );
  }

  const handleUpdateProfile = async (data: any) => {
    // Mock profile update - replace with real API call
    console.log('Updating profile:', data);
    // In a real app, you'd call your API here
    return Promise.resolve();
  };

  return (
    <UserDashboard 
      user={user} 
      onLogout={onLogout}
      onUpdateProfile={handleUpdateProfile}
    />
  );
}
