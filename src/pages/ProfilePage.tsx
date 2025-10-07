import { SEOHead } from '../components/SEO/SEOHead';
import { useAuth, LoginForm, RegisterForm } from '../features/auth';
import { Button } from '../components/ui/button';
import { User, LogOut, Settings, ShoppingBag, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (!isAuthenticated) {
    return (
      <>
        <SEOHead title="Sign In | CRNMN" noindex={true} />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="card-elevated">
              {showLogin ? (
                <LoginForm
                  onSuccess={() => {}}
                  onSwitchToRegister={() => setShowLogin(false)}
                />
              ) : (
                <RegisterForm
                  onSuccess={() => {}}
                  onSwitchToLogin={() => setShowLogin(true)}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="My Profile | CRNMN" noindex={true} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user?.name || 'User'}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/orders">
              <div className="card-interactive text-center p-6">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="font-semibold">My Orders</div>
                <div className="text-sm text-muted-foreground">View order history</div>
              </div>
            </Link>

            <div className="card-interactive text-center p-6 cursor-pointer">
              <Heart className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="font-semibold">Favorites</div>
              <div className="text-sm text-muted-foreground">Saved items</div>
            </div>

            <div className="card-interactive text-center p-6 cursor-pointer">
              <Settings className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="font-semibold">Settings</div>
              <div className="text-sm text-muted-foreground">Account settings</div>
            </div>

            <div className="card-interactive text-center p-6 cursor-pointer">
              <User className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="font-semibold">Edit Profile</div>
              <div className="text-sm text-muted-foreground">Update details</div>
            </div>
          </div>

          {/* Account Info */}
          <div className="card-elevated space-y-4">
            <h2 className="text-2xl font-bold">Account Information</h2>
            <div className="grid gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <div className="text-lg">{user?.name}</div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <div className="text-lg">{user?.email}</div>
              </div>
              {user?.phone && (
                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <div className="text-lg">{user.phone}</div>
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground">Member Since</label>
                <div className="text-lg">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-MY', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
